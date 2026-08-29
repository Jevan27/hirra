import crypto from 'crypto';
import { cvTextExtractor } from '../services/cvTextExtractor.js';
import { groqExtractionService } from '../services/groqExtractionService.js';
import { r2StorageService } from '../services/r2StorageService.js';
import { prisma } from '../config/prisma.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

/**
 * Helper to safely parse dates for PostgreSQL Date columns
 */
const safeDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Handle YYYY-MM by appending -01
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const d = new Date(`${trimmed}-01`);
    return isNaN(d.getTime()) ? null : d;
  }

  // Handle YYYY by appending -01-01
  if (/^\d{4}$/.test(trimmed)) {
    const d = new Date(`${trimmed}-01-01`);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Helper to create slug from skill name
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * Controller: Upload CV to Private Cloudflare R2, create Resume record, and extract with Groq fallback
 */
export const extractCv = async (req, res, next) => {
  let uploadedR2Key = null;

  console.log('\n======================================================');
  console.log(`[CV-ANALYSIS] 📥 Received extract-cv request`);
  console.log(`[CV-ANALYSIS] User: ${req.user?.email} (${req.user?.uid})`);

  try {
    if (!req.file) {
      console.error('[CV-ANALYSIS] ❌ No file received by Multer!');
      console.error('[CV-ANALYSIS] Request headers:', {
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length']
      });
      return res.status(400).json({
        success: false,
        error: 'NO_FILE_UPLOADED',
        message: 'Please upload a valid CV document (PDF, DOC, DOCX, or TXT).'
      });
    }

    const { buffer, mimetype, originalname, size } = req.file;
    const userId = req.user.uid;
    const resumeId = crypto.randomUUID();

    console.log(`[CV-ANALYSIS] 📄 Document: "${originalname}" | ${(size / 1024).toFixed(1)} KB | MIME: ${mimetype}`);

    // 1. Upload Original CV to Private Cloudflare R2 Storage (if configured)
    let objectKey = null;
    if (r2StorageService.isConfigured()) {
      try {
        console.log('[CV-ANALYSIS] ☁️ Uploading to Cloudflare R2...');
        const r2Result = await r2StorageService.uploadResume({
          buffer,
          mimeType: mimetype,
          originalName: originalname,
          userId,
          resumeId
        });
        objectKey = r2Result.objectKey;
        uploadedR2Key = objectKey;
        console.log(`[CV-ANALYSIS] ✅ Stored in R2 with key: ${objectKey}`);
      } catch (r2Err) {
        console.warn('[CV-ANALYSIS] ⚠️ R2 upload warning:', r2Err.message);
      }
    } else {
      console.log('[CV-ANALYSIS] ℹ️ Cloudflare R2 not configured. Skipping cloud file upload.');
    }

    // 2. Create PostgreSQL Resume Record (status: PROCESSING)
    let resumeRecord = null;
    try {
      console.log('[CV-ANALYSIS] 🗄️ Saving resume record in database...');
      // Set all other resumes for this user to isDefault: false
      await prisma.resume.updateMany({
        where: { userId },
        data: { isDefault: false }
      });

      resumeRecord = await prisma.resume.create({
        data: {
          id: resumeId,
          userId,
          name: originalname || 'resume.pdf',
          originalName: originalname || 'resume.pdf',
          objectKey,
          mimeType: mimetype,
          fileType: mimetype,
          size: size || buffer.length,
          status: 'PROCESSING',
          isDefault: true
        }
      });
      console.log(`[CV-ANALYSIS] ✅ Created Resume DB record ID: ${resumeId}`);
    } catch (dbErr) {
      console.error('[CV-ANALYSIS] ❌ Database error saving resume record:', dbErr.message);
      // Clean up orphaned R2 object if DB creation fails
      if (uploadedR2Key) {
        await r2StorageService.deleteResume(uploadedR2Key);
      }
      throw dbErr;
    }

    // 3. In-memory plain text extraction
    console.log('[CV-ANALYSIS] 🔍 Parsing document text...');
    const extractionResult = await cvTextExtractor.extractText(buffer, mimetype, originalname);

    if (!extractionResult.hasText) {
      console.warn(`[CV-ANALYSIS] ⚠️ Document contained no extractable text (${extractionResult.charCount} chars). Status -> FAILED.`);
      await prisma.resume.update({
        where: { id: resumeId },
        data: { status: 'FAILED' }
      });

      return res.status(200).json({
        success: false,
        code: 'NO_EXTRACTABLE_TEXT',
        message: "We couldn't extract readable text from this CV. Your document is saved, and you can complete your profile manually.",
        resume: {
          id: resumeRecord.id,
          name: resumeRecord.name,
          size: resumeRecord.size,
          status: 'FAILED'
        }
      });
    }

    console.log(`[CV-ANALYSIS] ✅ Extracted ${extractionResult.charCount} characters of readable text.`);
    console.log(`[CV-ANALYSIS] 📝 Snippet:\n"${extractionResult.text.slice(0, 250).replace(/\n+/g, ' ')}..."`);

    // 4. Groq AI Structured Extraction with Multi-Model Fallback Chain
    try {
      console.log('[CV-ANALYSIS] 🤖 Requesting AI extraction via Groq...');
      const { data: structuredData, modelUsed } = await groqExtractionService.extractCandidateData(extractionResult.text);

      console.log(`[CV-ANALYSIS] 🎉 Groq AI Extraction successful! (Model: ${modelUsed})`);
      console.log(`[CV-ANALYSIS] 👤 Extracted Candidate: ${structuredData.personal?.firstName || ''} ${structuredData.personal?.lastName || ''} | Title: ${structuredData.personal?.jobTitle || 'N/A'}`);
      console.log(`[CV-ANALYSIS] 💼 Experience: ${structuredData.experience?.length || 0} items | 🎓 Education: ${structuredData.education?.length || 0} items | 🛠️ Skills: ${structuredData.skills?.length || 0}`);

      // Update Resume status to COMPLETED
      const updatedResume = await prisma.resume.update({
        where: { id: resumeId },
        data: { status: 'COMPLETED' }
      });

      console.log('======================================================\n');

      return res.json({
        success: true,
        message: 'CV uploaded and analyzed successfully',
        modelUsed,
        data: structuredData,
        resume: {
          id: updatedResume.id,
          name: updatedResume.name,
          size: updatedResume.size,
          status: updatedResume.status,
          objectKey: updatedResume.objectKey
        }
      });
    } catch (aiError) {
      console.error('[CV-ANALYSIS] ❌ Groq AI extraction failed:', aiError.message);
      if (aiError.stack) console.error(aiError.stack);

      await prisma.resume.update({
        where: { id: resumeId },
        data: { status: 'FAILED' }
      });

      console.log('======================================================\n');

      return res.status(200).json({
        success: false,
        code: 'AI_EXTRACTION_UNAVAILABLE',
        message: "We couldn't analyze your CV right now. Your CV is safely uploaded, and you can retry or continue manually.",
        details: aiError.message,
        resume: {
          id: resumeRecord.id,
          name: resumeRecord.name,
          size: resumeRecord.size,
          status: 'FAILED'
        }
      });
    }
  } catch (err) {
    console.error('[CV-ANALYSIS] ❌ Fatal error in extractCv controller:', err);
    console.log('======================================================\n');
    next(err);
  }
};

/**
 * Controller: Generate temporary presigned download URL for authorized candidate CV
 * GET /api/candidate/resumes/:id/download
 */
export const downloadResume = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId // Strict candidate ownership verification
      }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'RESUME_NOT_FOUND',
        message: 'Resume not found or you are not authorized to access this document.'
      });
    }

    if (!resume.objectKey) {
      return res.status(400).json({
        success: false,
        error: 'NO_STORAGE_OBJECT',
        message: 'This resume does not have an associated file in cloud storage.'
      });
    }

    const downloadUrl = await r2StorageService.generatePresignedDownloadUrl(resume.objectKey, 300);

    res.json({
      success: true,
      downloadUrl,
      expiresInSeconds: 300,
      resume: {
        id: resume.id,
        name: resume.originalName || resume.name,
        mimeType: resume.mimeType,
        size: resume.size
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Retry AI extraction for an existing R2 CV without re-uploading
 * POST /api/candidate/resumes/:id/retry-extract
 */
export const retryExtraction = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId // Ownership verification
      }
    });

    if (!resume || !resume.objectKey) {
      return res.status(404).json({
        success: false,
        error: 'RESUME_NOT_FOUND',
        message: 'Resume file not found in storage.'
      });
    }

    // 1. Download buffer from R2
    const { buffer, mimeType } = await r2StorageService.getResumeBuffer(resume.objectKey);

    // 2. Extract plain text
    const extractionResult = await cvTextExtractor.extractText(buffer, mimeType, resume.originalName || resume.name);

    if (!extractionResult.hasText) {
      return res.status(200).json({
        success: false,
        code: 'NO_EXTRACTABLE_TEXT',
        message: "We couldn't extract readable text from this CV. You can continue and complete your profile manually."
      });
    }

    // 3. Run Groq fallback extraction
    const { data: structuredData, modelUsed } = await groqExtractionService.extractCandidateData(extractionResult.text);

    await prisma.resume.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    res.json({
      success: true,
      message: 'CV analyzed successfully on retry',
      modelUsed,
      data: structuredData,
      resume: {
        id: resume.id,
        name: resume.name,
        status: 'COMPLETED'
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Get candidate's resumes list
 * GET /api/candidate/resumes
 */
export const getResumes = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: resumes
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Delete candidate's resume from DB & R2
 * DELETE /api/candidate/resumes/:id
 */
export const deleteResume = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: { id, userId }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    if (resume.objectKey) {
      await r2StorageService.deleteResume(resume.objectKey);
    }

    await prisma.resume.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Get the authenticated candidate's profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    const user = await prisma.user.findUnique({
      where: { uid },
      include: {
        jobRole: true,
        resumes: { orderBy: { createdAt: 'desc' } },
        workHistory: { orderBy: { startDate: 'desc' } },
        education: { orderBy: { startDate: 'desc' } },
        certifications: { orderBy: { issueDate: 'desc' } },
        projects: {
          include: {
            skills: { include: { skill: true } }
          },
          orderBy: { startDate: 'desc' }
        },
        skills: {
          include: { skill: true }
        },
        links: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'Candidate profile retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Update/Save the authenticated candidate's complete profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const {
      personal = {},
      summary = null,
      experience = [],
      education = [],
      skills = [],
      certifications = [],
      projects = [],
      links = []
    } = req.body;

    // Execute in a single high-performance transactional unit
    const updatedUser = await prisma.$transaction(async (tx) => {
      // 1. Update Core User Info
      await tx.user.update({
        where: { uid },
        data: {
          firstName: personal.firstName ? String(personal.firstName).trim() : undefined,
          middleName: personal.middleName ? String(personal.middleName).trim() : undefined,
          lastName: personal.lastName ? String(personal.lastName).trim() : undefined,
          jobTitle: personal.jobTitle ? String(personal.jobTitle).trim() : undefined,
          phoneNumber: personal.phone ? String(personal.phone).trim() : undefined,
          address: personal.location || personal.city ? String(personal.location || personal.city).trim() : undefined,
          profileDescription: summary ? String(summary).trim() : undefined,
          birthday: safeDate(personal.birthday),
          profileCompleted: true
        }
      });

      // 2. Sync Work History (Batch)
      await tx.workHistory.deleteMany({ where: { userId: uid } });
      if (Array.isArray(experience) && experience.length > 0) {
        const historyData = experience
          .filter(exp => exp && exp.company && exp.jobTitle)
          .map(exp => ({
            userId: uid,
            companyName: String(exp.company).trim(),
            jobTitle: String(exp.jobTitle).trim(),
            startDate: safeDate(exp.startDate) || new Date('2020-01-01'),
            endDate: exp.isCurrent ? null : safeDate(exp.endDate),
            description: exp.description ? String(exp.description).trim() : null
          }));

        if (historyData.length > 0) {
          await tx.workHistory.createMany({ data: historyData });
        }
      }

      // 3. Sync Education (Batch)
      await tx.education.deleteMany({ where: { userId: uid } });
      if (Array.isArray(education) && education.length > 0) {
        const educationData = education
          .filter(edu => edu && edu.institution && edu.degree)
          .map(edu => ({
            userId: uid,
            institution: String(edu.institution).trim(),
            degree: String(edu.degree).trim(),
            fieldOfStudy: edu.fieldOfStudy ? String(edu.fieldOfStudy).trim() : 'General',
            startDate: safeDate(edu.startDate) || new Date('2018-01-01'),
            endDate: safeDate(edu.endDate),
            description: edu.description ? String(edu.description).trim() : null
          }));

        if (educationData.length > 0) {
          await tx.education.createMany({ data: educationData });
        }
      }

      // 4. Sync Certifications (Batch)
      await tx.certification.deleteMany({ where: { userId: uid } });
      if (Array.isArray(certifications) && certifications.length > 0) {
        const certData = certifications
          .filter(cert => cert && cert.name && cert.issuingOrganization)
          .map(cert => ({
            userId: uid,
            name: String(cert.name).trim(),
            issuingOrganization: String(cert.issuingOrganization).trim(),
            credentialId: cert.credentialId ? String(cert.credentialId).trim() : null,
            credentialUrl: cert.credentialUrl ? String(cert.credentialUrl).trim() : null,
            issueDate: safeDate(cert.issueDate) || new Date(),
            expirationDate: safeDate(cert.expirationDate)
          }));

        if (certData.length > 0) {
          await tx.certification.createMany({ data: certData });
        }
      }

      // 5. Sync Projects (Batch)
      await tx.project.deleteMany({ where: { userId: uid } });
      if (Array.isArray(projects) && projects.length > 0) {
        const projectData = projects
          .filter(proj => proj && proj.name)
          .map(proj => ({
            userId: uid,
            name: String(proj.name).trim(),
            description: proj.description ? String(proj.description).trim() : null,
            projectUrl: proj.projectUrl ? String(proj.projectUrl).trim() : null
          }));

        if (projectData.length > 0) {
          await tx.project.createMany({ data: projectData });
        }
      }

      // 6. Sync Links (Batch)
      await tx.userLink.deleteMany({ where: { userId: uid } });
      if (Array.isArray(links) && links.length > 0) {
        const validTypes = ['GITHUB', 'LINKEDIN', 'PORTFOLIO', 'BEHANCE', 'DRIBBBLE', 'WEBSITE', 'OTHER'];
        const linkData = links
          .filter(link => link && link.url)
          .map(link => {
            const rawType = String(link.type || 'WEBSITE').toUpperCase();
            const type = validTypes.includes(rawType) ? rawType : 'OTHER';
            return {
              userId: uid,
              type,
              url: String(link.url).trim()
            };
          });

        if (linkData.length > 0) {
          await tx.userLink.createMany({ data: linkData });
        }
      }

      // 7. Sync Skills (High-Performance Batch, Max 30 skills)
      await tx.userSkill.deleteMany({ where: { userId: uid } });
      const validSkills = Array.isArray(skills) ? skills.slice(0, 30) : [];
      if (validSkills.length > 0) {
        let defaultCategory = await tx.skillCategory.findFirst({
          where: { slug: 'technology' }
        });
        if (!defaultCategory) {
          defaultCategory = await tx.skillCategory.findFirst();
        }

        // Clean & deduplicate candidate skills
        const cleanSkillMap = new Map();
        for (const item of validSkills) {
          if (typeof item === 'string' && item.trim().length > 0) {
            const name = item.trim();
            const slug = slugify(name);
            if (slug && !cleanSkillMap.has(slug)) {
              cleanSkillMap.set(slug, name);
            }
          }
        }

        const slugs = Array.from(cleanSkillMap.keys());
        if (slugs.length > 0) {
          // 1 Query: Batch fetch existing skills
          const existingSkills = await tx.skill.findMany({
            where: { slug: { in: slugs } }
          });

          const existingMap = new Map(existingSkills.map(s => [s.slug, s]));
          const missingSkillsData = [];

          for (const [slug, name] of cleanSkillMap.entries()) {
            if (!existingMap.has(slug) && defaultCategory) {
              missingSkillsData.push({
                name,
                slug,
                categoryId: defaultCategory.id
              });
            }
          }

          // 1 Query: Batch create any missing master skills
          if (missingSkillsData.length > 0) {
            await tx.skill.createMany({
              data: missingSkillsData,
              skipDuplicates: true
            });
            const newlyCreated = await tx.skill.findMany({
              where: { slug: { in: missingSkillsData.map(m => m.slug) } }
            });
            newlyCreated.forEach(s => existingMap.set(s.slug, s));
          }

          // 1 Query: Batch insert all UserSkill junction records
          const userSkillsToCreate = [];
          for (const slug of slugs) {
            const skill = existingMap.get(slug);
            if (skill) {
              userSkillsToCreate.push({
                userId: uid,
                skillId: skill.id,
                proficiency: 'INTERMEDIATE'
              });
            }
          }

          if (userSkillsToCreate.length > 0) {
            await tx.userSkill.createMany({
              data: userSkillsToCreate,
              skipDuplicates: true
            });
          }
        }
      }

      // Return full updated profile
      return tx.user.findUnique({
        where: { uid },
        include: {
          jobRole: true,
          resumes: { orderBy: { createdAt: 'desc' } },
          workHistory: { orderBy: { startDate: 'desc' } },
          education: { orderBy: { startDate: 'desc' } },
          certifications: { orderBy: { issueDate: 'desc' } },
          projects: true,
          skills: { include: { skill: true } },
          links: true
        }
      });
    }, {
      maxWait: 15000,
      timeout: 30000 // 30 seconds
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Candidate profile saved successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Permanently delete candidate account and all associated data
 * Purges Cloudflare R2 resume files, cascades database rows, and deletes Supabase Auth user.
 * DELETE /api/candidate/account
 */
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    // 1. Fetch all candidate resumes from PostgreSQL to identify R2 objects
    const resumes = await prisma.resume.findMany({
      where: { userId },
      select: { objectKey: true }
    });

    // 2. Delete all resume files from Cloudflare R2
    if (r2StorageService.isConfigured() && resumes.length > 0) {
      for (const resume of resumes) {
        if (resume.objectKey) {
          try {
            await r2StorageService.deleteResume(resume.objectKey);
          } catch (r2Err) {
            console.warn(`[CandidateController] Could not delete R2 object ${resume.objectKey}:`, r2Err.message);
          }
        }
      }
    }

    // 3. Delete Candidate User from PostgreSQL (Cascade deletes all child records:
    //    resumes, workHistory, education, userSkills, certifications, projects, links, applications, etc.)
    await prisma.user.delete({
      where: { uid: userId }
    });

    // 4. Delete User from Supabase Auth admin API
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) {
          console.warn('[CandidateController] Supabase admin deleteUser warning:', error.message);
        }
      } catch (supaErr) {
        console.warn('[CandidateController] Supabase admin deleteUser exception:', supaErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Account, cloud storage files, and all associated profile data permanently deleted.'
    });
  } catch (err) {
    next(err);
  }
};

