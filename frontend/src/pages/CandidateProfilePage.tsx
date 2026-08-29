import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  FileText, 
  Lock, 
  Trash2, 
  Plus, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Settings,
  ShieldAlert,
  MapPin,
  Phone,
  Mail,
  RefreshCw
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

interface ResumeItem {
  id: string;
  name: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
  status: string;
  isDefault?: boolean;
  createdAt: string;
}

export const CandidateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, session, signOut, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'resume' | 'settings'>('profile');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
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
  const [resumes, setResumes] = useState<ResumeItem[]>([]);

  // Resume Download State
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Delete Account Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch full profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.access_token) return;
      setIsLoadingProfile(true);
      try {
        const response = await apiClient.get<{ success: boolean; data: any }>('/candidate/profile', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.data.success && response.data.data) {
          const u = response.data.data;
          setFirstName(u.firstName || '');
          setMiddleName(u.middleName || '');
          setLastName(u.lastName || '');
          setJobTitle(u.jobTitle || '');
          setPhoneNumber(u.phoneNumber || '');
          setLocation(u.address || '');
          setBirthday(u.birthday ? u.birthday.split('T')[0] : '');
          setSummary(u.profileDescription || '');

          if (Array.isArray(u.workHistory)) {
            setExperience(u.workHistory.map((w: any) => ({
              id: w.id,
              jobTitle: w.jobTitle || '',
              company: w.companyName || '',
              startDate: w.startDate ? w.startDate.split('T')[0] : '',
              endDate: w.endDate ? w.endDate.split('T')[0] : '',
              isCurrent: !w.endDate,
              description: w.description || '',
            })));
          }

          if (Array.isArray(u.education)) {
            setEducation(u.education.map((e: any) => ({
              id: e.id,
              institution: e.institution || '',
              degree: e.degree || '',
              fieldOfStudy: e.fieldOfStudy || '',
              startDate: e.startDate ? e.startDate.split('T')[0] : '',
              endDate: e.endDate ? e.endDate.split('T')[0] : '',
              description: e.description || '',
            })));
          }

          if (Array.isArray(u.skills)) {
            setSkills(u.skills.map((s: any) => s.skill?.name || s.name).filter(Boolean).slice(0, 30));
          }

          if (Array.isArray(u.certifications)) {
            setCertifications(u.certifications.map((c: any) => ({
              id: c.id,
              name: c.name || '',
              issuingOrganization: c.issuingOrganization || '',
              issueDate: c.issueDate ? c.issueDate.split('T')[0] : '',
              expirationDate: c.expirationDate ? c.expirationDate.split('T')[0] : '',
              credentialId: c.credentialId || '',
            })));
          }

          if (Array.isArray(u.projects)) {
            setProjects(u.projects.map((p: any) => ({
              id: p.id,
              name: p.name || '',
              description: p.description || '',
              projectUrl: p.projectUrl || '',
            })));
          }

          if (Array.isArray(u.resumes)) {
            setResumes(u.resumes);
          }
        }
      } catch (err: any) {
        console.error('[CandidateProfilePage] Fetch error:', err?.message);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [session]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

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
      experience: experience.filter(exp => exp.company && exp.jobTitle),
      education: education.filter(edu => edu.institution && edu.degree),
      skills: skills.slice(0, 30),
      certifications: certifications.filter(cert => cert.name),
      projects: projects.filter(proj => proj.name),
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
        setSaveSuccess(true);
        await refreshUser();
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(response.data.message || 'Failed to save profile updates.');
      }
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Presigned Resume Download
  const handleDownloadResume = async (resumeId: string) => {
    setDownloadingId(resumeId);
    try {
      const response = await apiClient.get<{
        success: boolean;
        downloadUrl: string;
        expiresInSeconds: number;
      }>(`/candidate/resumes/${resumeId}/download`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.data.success && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Unable to download CV at this time.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Skills Handlers
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

  // Experience Handlers
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

  // Education Handlers
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

  // Certification Handlers
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

  // Project Handlers
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

  // Handle Permanent Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') return;
    setIsDeletingAccount(true);
    setDeleteError(null);

    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        '/candidate/account',
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      if (response.data.success) {
        setIsDeleteModalOpen(false);
        await signOut();
        navigate('/', { replace: true });
      } else {
        setDeleteError(response.data.message || 'Failed to delete account.');
      }
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || err?.message || 'Failed to delete account.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin text-indigo-600 mx-auto" size={32} />
          <p className="text-sm font-semibold text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || user?.email || 'Candidate';
  const defaultResume = resumes.find(r => r.isDefault) || resumes[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Profile Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-indigo-600/30 shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                  {user?.role || 'CANDIDATE'}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {jobTitle || 'Job Seeker'}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    {location}
                  </span>
                )}
                {phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-slate-400" />
                    {phoneNumber}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-slate-400" />
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {defaultResume && (
              <Button
                variant="outline"
                size="sm"
                disabled={downloadingId === defaultResume.id}
                onClick={() => handleDownloadResume(defaultResume.id)}
                className="rounded-xl gap-2 font-semibold text-xs border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300"
              >
                {downloadingId === defaultResume.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                Download CV
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/candidate/onboarding')}
              className="rounded-xl gap-2 font-semibold text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw size={13} />
              Re-import CV
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <User size={16} />
          Profile & Career
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resume')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'resume'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <FileText size={16} />
          Resume / Documents ({resumes.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Settings size={16} />
          Account Settings
        </button>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          <span>Your profile updates have been saved successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle size={20} className="shrink-0 text-red-600" />
          <span>{saveError}</span>
        </div>
      )}

      {/* TAB 1: Profile & Career */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-8 animate-in fade-in">
          
          {/* Personal Information */}
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Professional Headline</label>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+63 912 345 6789" className="h-11 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Location / City</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Taguig, Metro Manila" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Birthday</label>
                <Input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Authoritative Email</label>
                <div className="relative">
                  <Input value={user?.email || ''} disabled className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/60 pr-10 text-slate-500 cursor-not-allowed" />
                  <Lock size={15} className="absolute right-3.5 top-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
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

          {/* Skills & Technologies */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Code className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skills & Technologies</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                skills.length >= 30 
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}>
                {skills.length} / 30 skills
              </span>
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
                  >
                    ×
                  </button>
                </span>
              ))}
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
                Maximum limit of 30 skills reached. Remove a skill to add a different one.
              </p>
            )}
          </div>

          {/* Work Experience */}
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={exp.description || ''}
                        onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                        placeholder="Responsibilities and accomplishments..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
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
                    >
                      <Trash2 size={17} />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">School / Institution *</label>
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

          {/* Certifications */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Award className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Certifications</h3>
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
                    >
                      <Trash2 size={16} />
                    </button>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Certificate Name *</label>
                      <Input value={cert.name} onChange={(e) => handleUpdateCertification(index, 'name', e.target.value)} placeholder="e.g. AWS Solutions Architect" className="h-10 rounded-xl" />
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

          {/* Featured Projects */}
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
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Project Name *</label>
                        <Input value={proj.name} onChange={(e) => handleUpdateProject(index, 'name', e.target.value)} placeholder="e.g. Hirra Recruitment Platform" className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Project URL</label>
                        <Input value={proj.projectUrl || ''} onChange={(e) => handleUpdateProject(index, 'projectUrl', e.target.value)} placeholder="https://github.com/..." className="h-10 rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description || ''}
                        onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                        placeholder="Brief summary of what you built..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-indigo-600/30 gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Save Changes
                </>
              )}
            </Button>
          </div>

        </form>
      )}

      {/* TAB 2: Resume / Documents */}
      {activeTab === 'resume' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cloudflare R2 Stored Resumes</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Your uploaded CVs are safely stored in your private Cloudflare R2 bucket.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/candidate/onboarding')}
                className="rounded-xl gap-2 text-xs font-semibold"
              >
                <Plus size={14} /> Upload New CV
              </Button>
            </div>

            {resumes.length === 0 ? (
              <div className="text-center py-10">
                <FileText size={36} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-500">No resumes uploaded yet.</p>
                <Button
                  onClick={() => navigate('/candidate/onboarding')}
                  className="mt-4 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Upload CV via Onboarding
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 shrink-0">
                        <FileText size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-900 dark:text-white">
                            {resume.originalName || resume.name}
                          </p>
                          {resume.isDefault && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {resume.size ? `${(resume.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF'} • Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloadingId === resume.id}
                        onClick={() => handleDownloadResume(resume.id)}
                        className="rounded-xl gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                      >
                        {downloadingId === resume.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Account Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Account Overview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Authoritative Email</label>
                <div className="relative">
                  <Input value={user?.email || ''} disabled className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/60 pr-10 text-slate-500 cursor-not-allowed" />
                  <Lock size={15} className="absolute right-3.5 top-3.5 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Account Role</label>
                <Input value={user?.role || 'CANDIDATE'} disabled className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-500 cursor-not-allowed uppercase font-bold" />
              </div>
            </div>
          </div>

          {/* Destructive Account Deletion Section */}
          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-700 dark:text-red-300">Delete Account</h3>
                <p className="text-xs sm:text-sm text-red-600/80 dark:text-red-400/80">
                  Permanently delete your Hirra candidate account and all associated data.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
              Deleting your account is <strong>permanent and irreversible</strong>. Your candidate profile, Cloudflare R2 uploaded CV files, job applications, saved jobs, and Supabase Auth credentials will be completely purged from Hirra's systems.
            </p>

            <div className="pt-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setDeleteConfirmationText('');
                  setDeleteError(null);
                  setIsDeleteModalOpen(true);
                }}
                className="rounded-xl px-6 h-11 font-bold text-xs sm:text-sm cursor-pointer shadow-md shadow-red-600/20"
              >
                <Trash2 size={16} className="mr-2" />
                Delete My Account
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* Account Deletion Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 shadow-2xl">
          <DialogHeader className="text-left space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
              <ShieldAlert size={24} />
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              This action cannot be undone. This will permanently delete your profile, work experience, education, Cloudflare R2 resume files, and authentication account.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Please type <strong className="text-red-600 font-extrabold uppercase">DELETE</strong> to confirm:
            </label>
            <Input
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="DELETE"
              className="h-11 rounded-xl border-slate-300 dark:border-slate-700 font-mono text-center tracking-widest text-sm font-bold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-xl px-5 h-11 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteConfirmationText !== 'DELETE' || isDeletingAccount}
              onClick={handleDeleteAccount}
              className="rounded-xl px-5 h-11 text-xs font-bold gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting Everything...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Permanently Delete
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};
