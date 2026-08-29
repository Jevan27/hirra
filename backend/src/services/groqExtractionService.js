import Groq from 'groq-sdk';

const EXTRACTION_SYSTEM_PROMPT = `You are a precision AI data extraction assistant for Hirra, a modern recruitment platform.
Your task is to extract structured professional information from an uploaded candidate CV/resume.

CRITICAL RULES:
1. Extract ONLY information explicitly present in the document.
2. NEVER invent, infer, or hallucinate information (companies, dates, degrees, certifications, skills, projects, phone numbers).
3. If any field or section is missing from the CV, return null (for strings) or an empty array [] (for lists).
4. Do NOT rewrite or embellish descriptions. Preserve original bullet points and responsibilities cleanly.
5. Deduplicate skills that clearly refer to the same technology (e.g., 'React', 'React.js' -> 'React').
6. Format dates as standard YYYY-MM-DD or YYYY-MM strings where discernible; if only year is given, use YYYY-01-01. If end date is current/present, set isCurrent: true and endDate: null.
7. Return a valid JSON object matching the exact schema specified.`;

const EXTRACTION_JSON_SCHEMA_EXAMPLE = {
  personal: {
    firstName: "string or null",
    middleName: "string or null",
    lastName: "string or null",
    jobTitle: "string or null (e.g. Current or Target Title)",
    phone: "string or null",
    location: "string or null (e.g. City, Country)",
    city: "string or null",
    country: "string or null",
    birthday: "string or null"
  },
  summary: "string or null (Professional summary or bio)",
  experience: [
    {
      jobTitle: "string",
      company: "string",
      location: "string or null",
      employmentType: "string or null (Full-time, Part-time, Contract, Internship, Freelance)",
      startDate: "string or null (YYYY-MM-DD or YYYY-MM)",
      endDate: "string or null (YYYY-MM-DD or null if current)",
      isCurrent: false,
      description: "string or null (bullet points or paragraph)"
    }
  ],
  education: [
    {
      institution: "string",
      degree: "string",
      fieldOfStudy: "string or null",
      startDate: "string or null",
      endDate: "string or null",
      description: "string or null"
    }
  ],
  skills: ["string"],
  certifications: [
    {
      name: "string",
      issuingOrganization: "string",
      issueDate: "string or null",
      expirationDate: "string or null",
      credentialId: "string or null",
      credentialUrl: "string or null"
    }
  ],
  projects: [
    {
      name: "string",
      description: "string or null",
      projectUrl: "string or null",
      technologies: ["string"]
    }
  ],
  links: [
    {
      type: "GITHUB | LINKEDIN | PORTFOLIO | WEBSITE | OTHER",
      url: "string"
    }
  ]
};

// Default prioritized model fallback hierarchy (Best reasoning/context -> fast/lightweight fallback)
const DEFAULT_MODEL_HIERARCHY = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
  'openai/gpt-oss-20b',
  'groq/compound',
  'groq/compound-mini',
  'allam-2-7b'
];

class GroqExtractionService {
  constructor() {
    this.groqClient = null;
  }

  getGroqClient() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      const error = new Error('Groq API key is not configured on the server. Please set GROQ_API_KEY in backend/.env.');
      error.statusCode = 503;
      error.code = 'GROQ_CONFIG_MISSING';
      throw error;
    }

    if (!this.groqClient) {
      this.groqClient = new Groq({ apiKey });
    }
    return this.groqClient;
  }

  /**
   * Build the prioritized list of models to try in sequence
   * @returns {string[]}
   */
  getModelChain() {
    const primaryModel = process.env.GROQ_MODEL?.trim();
    const fallbackEnv = process.env.GROQ_FALLBACK_MODELS?.trim();

    const envFallbacks = fallbackEnv
      ? fallbackEnv.split(',').map(m => m.trim()).filter(Boolean)
      : [];

    const orderedCandidates = [
      ...(primaryModel ? [primaryModel] : []),
      ...envFallbacks,
      ...DEFAULT_MODEL_HIERARCHY
    ];

    // Deduplicate while preserving priority order
    return Array.from(new Set(orderedCandidates));
  }

  /**
   * Validate and sanitize AI structured response
   * @param {Object} rawData
   * @returns {Object} Cleaned structured candidate data
   */
  sanitizeExtractionData(rawData) {
    if (!rawData || typeof rawData !== 'object') {
      return {
        personal: {},
        summary: null,
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: [],
        links: []
      };
    }

    const personal = rawData.personal || {};
    const summary = typeof rawData.summary === 'string' ? rawData.summary.trim() : null;

    // Sanitize experience array
    const experience = Array.isArray(rawData.experience)
      ? rawData.experience
          .filter(exp => exp && (exp.jobTitle || exp.company))
          .map(exp => ({
            jobTitle: String(exp.jobTitle || 'Position').trim(),
            company: String(exp.company || 'Company').trim(),
            location: exp.location ? String(exp.location).trim() : null,
            employmentType: exp.employmentType ? String(exp.employmentType).trim() : 'Full-time',
            startDate: exp.startDate ? String(exp.startDate).trim() : null,
            endDate: exp.endDate ? String(exp.endDate).trim() : null,
            isCurrent: Boolean(exp.isCurrent || (!exp.endDate && exp.startDate)),
            description: exp.description ? String(exp.description).trim() : null
          }))
      : [];

    // Sanitize education array
    const education = Array.isArray(rawData.education)
      ? rawData.education
          .filter(edu => edu && (edu.institution || edu.degree))
          .map(edu => ({
            institution: String(edu.institution || 'Institution').trim(),
            degree: String(edu.degree || 'Degree').trim(),
            fieldOfStudy: edu.fieldOfStudy ? String(edu.fieldOfStudy).trim() : null,
            startDate: edu.startDate ? String(edu.startDate).trim() : null,
            endDate: edu.endDate ? String(edu.endDate).trim() : null,
            description: edu.description ? String(edu.description).trim() : null
          }))
      : [];

    // Deduplicate and sanitize skills (Max 30 skills)
    const rawSkills = Array.isArray(rawData.skills) ? rawData.skills : [];
    const skillSet = new Set();
    const skills = [];
    for (const item of rawSkills) {
      if (typeof item === 'string' && item.trim().length > 1) {
        const cleaned = item.trim();
        const lower = cleaned.toLowerCase();
        if (!skillSet.has(lower)) {
          skillSet.add(lower);
          skills.push(cleaned);
          if (skills.length >= 30) break;
        }
      }
    }

    // Sanitize certifications
    const certifications = Array.isArray(rawData.certifications)
      ? rawData.certifications
          .filter(cert => cert && (cert.name || cert.issuingOrganization))
          .map(cert => ({
            name: String(cert.name || 'Certification').trim(),
            issuingOrganization: String(cert.issuingOrganization || 'Organization').trim(),
            issueDate: cert.issueDate ? String(cert.issueDate).trim() : null,
            expirationDate: cert.expirationDate ? String(cert.expirationDate).trim() : null,
            credentialId: cert.credentialId ? String(cert.credentialId).trim() : null,
            credentialUrl: cert.credentialUrl ? String(cert.credentialUrl).trim() : null
          }))
      : [];

    // Sanitize projects
    const projects = Array.isArray(rawData.projects)
      ? rawData.projects
          .filter(proj => proj && proj.name)
          .map(proj => ({
            name: String(proj.name).trim(),
            description: proj.description ? String(proj.description).trim() : null,
            projectUrl: proj.projectUrl ? String(proj.projectUrl).trim() : null,
            technologies: Array.isArray(proj.technologies) ? proj.technologies.map(t => String(t).trim()).filter(Boolean) : []
          }))
      : [];

    // Sanitize links
    const links = Array.isArray(rawData.links)
      ? rawData.links
          .filter(link => link && link.url)
          .map(link => {
            const rawType = String(link.type || 'WEBSITE').toUpperCase();
            const validTypes = ['GITHUB', 'LINKEDIN', 'PORTFOLIO', 'BEHANCE', 'DRIBBBLE', 'WEBSITE', 'OTHER'];
            const type = validTypes.includes(rawType) ? rawType : 'OTHER';
            return {
              type,
              url: String(link.url).trim()
            };
          })
      : [];

    return {
      personal: {
        firstName: personal.firstName ? String(personal.firstName).trim() : null,
        middleName: personal.middleName ? String(personal.middleName).trim() : null,
        lastName: personal.lastName ? String(personal.lastName).trim() : null,
        jobTitle: personal.jobTitle ? String(personal.jobTitle).trim() : null,
        phone: personal.phone ? String(personal.phone).trim() : null,
        location: personal.location ? String(personal.location).trim() : null,
        city: personal.city ? String(personal.city).trim() : null,
        country: personal.country ? String(personal.country).trim() : null,
        birthday: personal.birthday ? String(personal.birthday).trim() : null
      },
      summary,
      experience,
      education,
      skills,
      certifications,
      projects,
      links
    };
  }

  /**
   * Extract candidate profile data from plain text using Groq with multi-model fallback chain
   * @param {string} text - Cleaned CV text
   * @returns {Promise<{ data: Object, modelUsed: string }>}
   */
  async extractCandidateData(text) {
    if (!text || text.trim().length < 30) {
      throw new Error('CV text content is too short or empty for analysis.');
    }

    const groq = this.getGroqClient();
    const modelChain = this.getModelChain();
    const userPrompt = `Extract structured profile data from this CV text:\n\n---\n${text.slice(0, 32000)}\n---\n\nFormat your response as a JSON object matching this schema structure:\n${JSON.stringify(EXTRACTION_JSON_SCHEMA_EXAMPLE, null, 2)}`;

    let lastError = null;

    for (const model of modelChain) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          model,
          temperature: 0.1, // Low temperature for maximum factuality
          response_format: { type: 'json_object' }
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
          throw new Error(`Empty response received from Groq model '${model}'`);
        }

        const parsedData = JSON.parse(responseContent);
        const sanitized = this.sanitizeExtractionData(parsedData);

        return {
          data: sanitized,
          modelUsed: model
        };
      } catch (err) {
        lastError = err;
        const statusCode = err.status || err.statusCode;

        // Do NOT fallback if credentials are fundamentally invalid (401 / 403)
        if (statusCode === 401 || statusCode === 403) {
          console.error(`[GroqExtractionService] Auth error (Status ${statusCode}): ${err.message}`);
          const fatalError = new Error('Groq API authentication failed. Please verify your GROQ_API_KEY.');
          fatalError.statusCode = 401;
          fatalError.code = 'GROQ_AUTH_FAILED';
          throw fatalError;
        }

        // Provider errors, 429 rate limit, 500/502/503/504, model not found -> Fallback to next model
        console.warn(`[GroqExtractionService] Model '${model}' failed (${err.message}). Cascading to next fallback model...`);
      }
    }

    // If all models in the chain failed
    console.error('[GroqExtractionService] All Groq fallback models exhausted.');
    const error = new Error('All Groq AI models exhausted or unavailable for CV extraction');
    error.statusCode = 502;
    error.code = 'AI_EXTRACTION_FAILED';
    error.details = lastError?.message;
    throw error;
  }
}

export const groqExtractionService = new GroqExtractionService();
