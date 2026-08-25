export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const POPULAR_SEARCH_TAGS = [
  { label: 'Software Engineer', query: 'Software Engineer' },
  { label: 'Remote', query: 'Remote' },
  { label: 'Data Analyst', query: 'Data Analyst' },
  { label: 'UI/UX Designer', query: 'Designer' },
];

export const WORK_ARRANGEMENTS = [
  { label: 'All Arrangements', value: 'all' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'On-site', value: 'On-site' },
];

export const EMPLOYMENT_TYPES = [
  { label: 'All Types', value: 'all' },
  { label: 'Full-time', value: 'Full-time' },
  { label: 'Part-time', value: 'Part-time' },
  { label: 'Contract', value: 'Contract' },
  { label: 'Internship', value: 'Internship' },
];

export const EXPERIENCE_LEVELS = [
  { label: 'All Levels', value: 'all' },
  { label: 'Junior', value: 'Junior' },
  { label: 'Mid-Level', value: 'Mid-Level' },
  { label: 'Senior', value: 'Senior' },
  { label: 'Lead', value: 'Lead' },
];
