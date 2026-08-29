import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  User, 
  Lock,
  Loader2
} from 'lucide-react';

interface ExperienceItem {
  id?: string;
  jobTitle: string;
  company: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface CertificationItem {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

interface ProjectItem {
  id?: string;
  name: string;
  description?: string;
  projectUrl?: string;
  technologies?: string[];
}

export const CandidateOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, session, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stepper state: 1 = Upload CV, 2 = AI Processing, 3 = Review & Edit, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [currentResume, setCurrentResume] = useState<{ id: string; name: string; status: string } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // AI Extraction State
  const [extractingStep, setExtractingStep] = useState(0);
  const [extractionWarning, setExtractionWarning] = useState<string | null>(null);

  // Form Profile State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [jobTitle, setJobTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [birthday, setBirthday] = useState('');
  const [summary, setSummary] = useState('');

  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Handle File Selection
  const handleFileChange = (file: File) => {
    setFileError(null);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setFileError('Please select a PDF, DOCX, DOC, or TXT document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Step 2: Trigger AI Extraction
  const handleAnalyzeCv = async () => {
    if (!selectedFile) return;

    setStep(2);
    setExtractionWarning(null);
    setExtractingStep(1); // 1: Reading document

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const stepTimer1 = setTimeout(() => setExtractingStep(2), 700); // 2: Extracting info
      const stepTimer2 = setTimeout(() => setExtractingStep(3), 1500); // 3: Structuring data

      const response = await apiClient.post<{
        success: boolean;
        code?: string;
        message?: string;
        data?: any;
        resume?: { id: string; name: string; status: string };
      }>('/candidate/extract-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (response.data.resume) {
        setCurrentResume(response.data.resume);
      }

      if (response.data.success && response.data.data) {
        const extracted = response.data.data;

        // Populate Form
        if (extracted.personal?.firstName) setFirstName(extracted.personal.firstName);
        if (extracted.personal?.middleName) setMiddleName(extracted.personal.middleName);
        if (extracted.personal?.lastName) setLastName(extracted.personal.lastName);
        if (extracted.personal?.jobTitle) setJobTitle(extracted.personal.jobTitle);
        if (extracted.personal?.phone) setPhoneNumber(extracted.personal.phone);
        if (extracted.personal?.location) setLocation(extracted.personal.location);
        if (extracted.personal?.birthday) setBirthday(extracted.personal.birthday);
        if (extracted.summary) setSummary(extracted.summary);

        if (Array.isArray(extracted.experience)) setExperience(extracted.experience);
        if (Array.isArray(extracted.education)) setEducation(extracted.education);
        if (Array.isArray(extracted.skills)) setSkills(extracted.skills.slice(0, 30));
        if (Array.isArray(extracted.certifications)) setCertifications(extracted.certifications);
        if (Array.isArray(extracted.projects)) setProjects(extracted.projects);

        setStep(3);
      } else {
        // Fallback message if extraction was partial or scanned image
        setExtractionWarning(response.data.message || 'We could not extract text from this document. Your file is saved, and you can complete your profile manually.');
        setStep(3);
      }
    } catch (err: any) {
      console.warn('[Onboarding] Extraction fallback:', err?.message);
      setExtractionWarning('AI CV analysis is temporarily unavailable. Your file is safely stored, and you can enter your details below.');
      setStep(3);
    }
  };

  // Retry AI Analysis for an already stored CV in R2
  const handleRetryExtraction = async () => {
    if (!currentResume?.id) return;
    setIsRetrying(true);
    setExtractionWarning(null);

    try {
      const response = await apiClient.post<{
        success: boolean;
        message?: string;
        data?: any;
      }>(`/candidate/resumes/${currentResume.id}/retry-extract`, {}, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.data.success && response.data.data) {
        const extracted = response.data.data;
        if (extracted.personal?.firstName) setFirstName(extracted.personal.firstName);
        if (extracted.personal?.middleName) setMiddleName(extracted.personal.middleName);
        if (extracted.personal?.lastName) setLastName(extracted.personal.lastName);
        if (extracted.personal?.jobTitle) setJobTitle(extracted.personal.jobTitle);
        if (extracted.personal?.phone) setPhoneNumber(extracted.personal.phone);
        if (extracted.personal?.location) setLocation(extracted.personal.location);
        if (extracted.personal?.birthday) setBirthday(extracted.personal.birthday);
        if (extracted.summary) setSummary(extracted.summary);

        if (Array.isArray(extracted.experience)) setExperience(extracted.experience);
        if (Array.isArray(extracted.education)) setEducation(extracted.education);
        if (Array.isArray(extracted.skills)) setSkills(extracted.skills.slice(0, 30));
        if (Array.isArray(extracted.certifications)) setCertifications(extracted.certifications);
        if (Array.isArray(extracted.projects)) setProjects(extracted.projects);

        setCurrentResume({ ...currentResume, status: 'COMPLETED' });
      } else {
        setExtractionWarning(response.data.message || 'Retry extraction did not find extractable text.');
      }
    } catch (err: any) {
      console.warn('[Onboarding] Retry extraction error:', err?.message);
      setExtractionWarning('Retry analysis failed. Please complete your profile details manually.');
    } finally {
      setIsRetrying(false);
    }
  };

  // Skip CV
  const handleSkipCv = () => {
    setStep(3);
  };

  // Skills Tag Handlers (Max 30 skills, no minimum)
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (skills.length >= 30) return;
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;

    if (!skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed].slice(0, 30));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Experience Card Handlers
  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        jobTitle: '',
        company: '',
        location: '',
        employmentType: 'Full-time',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
      },
    ]);
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Education Card Handlers
  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Certification Card Handlers
  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
      },
    ]);
  };

  const handleUpdateCertification = (index: number, field: keyof CertificationItem, value: any) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Project Card Handlers
  const handleAddProject = () => {
    setProjects([
      ...projects,
      {
        name: '',
        description: '',
        projectUrl: '',
        technologies: [],
      },
    ]);
  };

  const handleUpdateProject = (index: number, field: keyof ProjectItem, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Step 3 -> Save Profile to Database
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    const payload = {
      personal: {
        firstName,
        middleName,
        lastName,
        jobTitle,
        phone: phoneNumber,
        location,
        birthday,
      },
      summary,
      experience: experience.filter(e => e.company && e.jobTitle),
      education: education.filter(e => e.institution && e.degree),
      skills,
      certifications: certifications.filter(c => c.name),
      projects: projects.filter(p => p.name),
    };

    try {
      const response = await apiClient.put<{ success: boolean; message: string; data: any }>(
        '/candidate/profile',
        payload,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      if (response.data.success) {
        await refreshUser();
        setStep(4);
      } else {
        setSaveError(response.data.message || 'Failed to save profile.');
      }
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Failed to save candidate profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Stepper Progress Bar */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              step >= 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
            }`}>
              1
            </div>
            <span className="text-xs font-semibold mt-2 text-slate-700 dark:text-slate-300">Import CV</span>
          </div>

          <div className={`flex-1 h-1 mx-3 rounded transition-all ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`} />

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              step >= 3 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
            }`}>
              2
            </div>
            <span className="text-xs font-semibold mt-2 text-slate-700 dark:text-slate-300">Review & Edit</span>
          </div>

          <div className={`flex-1 h-1 mx-3 rounded transition-all ${step === 4 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`} />

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              step === 4 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
            }`}>
              ✓
            </div>
            <span className="text-xs font-semibold mt-2 text-slate-700 dark:text-slate-300">Complete</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Upload CV */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm animate-in fade-in">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
              <Sparkles size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Build your Hirra profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Upload your CV and Hirra's AI will extract your experience, skills, and education automatically. You can review and edit everything before saving.
            </p>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-900/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
              <UploadCloud size={30} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Drag & drop your CV file here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
              Supports PDF, DOCX, DOC, or TXT up to 10MB
            </p>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold"
            >
              Browse Files
            </Button>
          </div>

          {fileError && (
            <div className="mt-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{fileError}</span>
            </div>
          )}

          {/* Selected File Card */}
          {selectedFile && (
            <div className="mt-6 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="text-slate-500 hover:text-red-600 rounded-xl"
                >
                  <Trash2 size={16} />
                </Button>
                <Button
                  onClick={handleAnalyzeCv}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-5 gap-2 shadow-md shadow-indigo-600/30"
                >
                  <Sparkles size={16} />
                  Analyze CV
                </Button>
              </div>
            </div>
          )}

          {/* Skip Link */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSkipCv}
              className="text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Continue without a CV</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Processing State */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-lg mx-auto shadow-sm animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
            <Loader2 size={32} className="animate-spin" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            Analyzing your CV...
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Hirra is reading your document and structuring your professional background.
          </p>

          <div className="space-y-3.5 max-w-xs mx-auto text-left text-sm font-medium">
            <div className={`flex items-center gap-3 ${extractingStep >= 1 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
              <CheckCircle2 size={18} className={extractingStep >= 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300'} />
              <span>Reading your CV document</span>
            </div>
            <div className={`flex items-center gap-3 ${extractingStep >= 2 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
              <CheckCircle2 size={18} className={extractingStep >= 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300'} />
              <span>Extracting experience & education</span>
            </div>
            <div className={`flex items-center gap-3 ${extractingStep >= 3 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
              <CheckCircle2 size={18} className={extractingStep >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300'} />
              <span>Structuring candidate profile</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Edit Form */}
      {step === 3 && (
        <form onSubmit={handleSaveProfile} className="space-y-8 animate-in fade-in">
          
          {/* Top Banner */}
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-3xl p-6 sm:p-8 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Review your profile details
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Please review the information below. You can correct, add, or delete any details before saving your profile.
                </p>
                {currentResume && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <FileText size={14} className="text-indigo-600" />
                    <span>Stored in Cloudflare R2: <strong>{currentResume.name}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {currentResume?.status === 'FAILED' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isRetrying}
                onClick={handleRetryExtraction}
                className="shrink-0 rounded-xl border-indigo-300 text-indigo-700 dark:text-indigo-300 gap-1.5"
              >
                {isRetrying ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isRetrying ? 'Retrying...' : 'Retry AI Analysis'}
              </Button>
            )}
          </div>

          {extractionWarning && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <span>{extractionWarning}</span>
              </div>
              {currentResume?.id && (
                <button
                  type="button"
                  onClick={handleRetryExtraction}
                  disabled={isRetrying}
                  className="font-bold underline hover:no-underline text-xs shrink-0 cursor-pointer"
                >
                  {isRetrying ? 'Retrying...' : 'Retry Analysis'}
                </button>
              )}
            </div>
          )}

          {saveError && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <User className="text-indigo-600 dark:text-indigo-400" size={22} />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">First Name *</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Middle Name</label>
                <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Robert" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Last Name *</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" className="h-11 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Professional Headline / Target Role</label>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+63 912 345 6789" className="h-11 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Location / City</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Taguig, Metro Manila" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Account Email (Authoritative)</label>
                <div className="relative">
                  <Input value={user?.email || ''} disabled className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/60 pr-10 text-slate-500 cursor-not-allowed" />
                  <Lock size={15} className="absolute right-3.5 top-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Professional Summary</h3>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a concise overview of your background, core strengths, and career focus..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Section 3: Skills */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Code className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skills & Technologies</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  skills.length >= 30 
                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}>
                  {skills.length} / 30 skills
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold text-xs sm:text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-100 font-bold ml-0.5"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-xs text-slate-400 italic py-1">No skills added yet (optional, max 30).</p>
              )}
            </div>

            {skills.length < 30 ? (
              <div className="flex gap-2 pt-2">
                <Input
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  placeholder="Type a skill and press Enter (e.g. React, PostgreSQL)..."
                  className="h-11 rounded-xl"
                />
                <Button type="button" onClick={handleAddSkill} variant="outline" className="h-11 rounded-xl px-4 shrink-0">
                  <Plus size={16} className="mr-1" /> Add
                </Button>
              </div>
            ) : (
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 pt-1">
                Maximum limit of 30 skills reached. Remove a skill if you'd like to add a different one.
              </p>
            )}
          </div>

          {/* Section 4: Work Experience */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Briefcase className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Work Experience</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddExperience} className="rounded-xl gap-1">
                <Plus size={15} /> Add Position
              </Button>
            </div>

            {experience.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No work experience listed yet.</p>
            ) : (
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative space-y-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove experience"
                    >
                      <Trash2 size={17} />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Job Title *</label>
                        <Input value={exp.jobTitle} onChange={(e) => handleUpdateExperience(index, 'jobTitle', e.target.value)} required placeholder="e.g. Software Engineer" className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Company Name *</label>
                        <Input value={exp.company} onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)} required placeholder="e.g. Acme Technologies" className="h-10 rounded-xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Location</label>
                        <Input value={exp.location || ''} onChange={(e) => handleUpdateExperience(index, 'location', e.target.value)} placeholder="e.g. Manila, Remote" className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Start Date</label>
                        <Input type="text" value={exp.startDate || ''} onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)} placeholder="YYYY-MM" className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">End Date</label>
                        <Input type="text" disabled={exp.isCurrent} value={exp.isCurrent ? 'Present' : (exp.endDate || '')} onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)} placeholder="YYYY-MM" className="h-10 rounded-xl disabled:bg-slate-100 dark:disabled:bg-slate-800" />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(exp.isCurrent)}
                        onChange={(e) => handleUpdateExperience(index, 'isCurrent', e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>I currently work in this role</span>
                    </label>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Key Responsibilities / Impact</label>
                      <textarea
                        rows={3}
                        value={exp.description || ''}
                        onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                        placeholder="Highlight achievements, key technologies, and contributions..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Education */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Education</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddEducation} className="rounded-xl gap-1">
                <Plus size={15} /> Add Education
              </Button>
            </div>

            {education.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No education listed yet.</p>
            ) : (
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative space-y-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove education"
                    >
                      <Trash2 size={17} />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">School / University *</label>
                        <Input value={edu.institution} onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)} required placeholder="e.g. University of the Philippines" className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Degree *</label>
                        <Input value={edu.degree} onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)} required placeholder="e.g. Bachelor of Science" className="h-10 rounded-xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Field of Study</label>
                        <Input value={edu.fieldOfStudy || ''} onChange={(e) => handleUpdateEducation(index, 'fieldOfStudy', e.target.value)} placeholder="e.g. Computer Science" className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Start Date</label>
                        <Input type="text" value={edu.startDate || ''} onChange={(e) => handleUpdateEducation(index, 'startDate', e.target.value)} placeholder="YYYY" className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">End Date</label>
                        <Input type="text" value={edu.endDate || ''} onChange={(e) => handleUpdateEducation(index, 'endDate', e.target.value)} placeholder="YYYY" className="h-10 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Certifications */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Award className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Certifications & Licenses</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddCertification} className="rounded-xl gap-1">
                <Plus size={15} /> Add Certificate
              </Button>
            </div>

            {certifications.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No certifications listed.</p>
            ) : (
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove certificate"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Certificate Name *</label>
                      <Input value={cert.name} onChange={(e) => handleUpdateCertification(index, 'name', e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" className="h-10 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Issuing Organization *</label>
                      <Input value={cert.issuingOrganization} onChange={(e) => handleUpdateCertification(index, 'issuingOrganization', e.target.value)} placeholder="e.g. Amazon Web Services" className="h-10 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 7: Projects */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Code className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Featured Projects</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddProject} className="rounded-xl gap-1">
                <Plus size={15} /> Add Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No projects listed.</p>
            ) : (
              <div className="space-y-4">
                {projects.map((proj, index) => (
                  <div key={index} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative space-y-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove project"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Project Name *</label>
                        <Input value={proj.name} onChange={(e) => handleUpdateProject(index, 'name', e.target.value)} placeholder="e.g. E-Commerce Platform" className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Project URL / Repository</label>
                        <Input value={proj.projectUrl || ''} onChange={(e) => handleUpdateProject(index, 'projectUrl', e.target.value)} placeholder="https://github.com/..." className="h-10 rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description || ''}
                        onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                        placeholder="Brief summary of what you built and the impact..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="w-full sm:w-auto rounded-xl px-6 h-12"
            >
              Back to CV Upload
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-indigo-600/30 gap-2 text-base cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Save & Complete Profile
                </>
              )}
            </Button>
          </div>

        </form>
      )}

      {/* STEP 4: Success Screen */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-lg mx-auto shadow-sm animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
            <CheckCircle2 size={34} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Profile Created Successfully!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Your candidate profile is now live. You can apply to top opportunities with one click and get matched with hiring companies.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/profile', { replace: true })}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 shadow-lg shadow-indigo-600/30 text-sm sm:text-base cursor-pointer"
            >
              View & Manage Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/jobs', { replace: true })}
              className="flex-1 rounded-xl h-12 text-sm sm:text-base font-semibold border-slate-200 dark:border-slate-800"
            >
              Explore Jobs
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
