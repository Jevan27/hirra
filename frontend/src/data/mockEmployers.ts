/**
 * Mock content for the For Employers landing page.
 * All numbers, companies, and people here are illustrative placeholders —
 * they are NOT real platform data. Replace with live data once the
 * employer product surface exists.
 */

export interface DashboardStat {
  label: string;
  value: number;
  delta: string;
  deltaPositive?: boolean;
}

export interface MockJobRow {
  title: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Internship';
  applicants: number;
  status: 'Active' | 'In Review';
  postedLabel: string;
}

export interface PipelineStage {
  label: string;
  count: number;
}

export interface MockApplicant {
  name: string;
  headline: string;
  initials: string;
  match: number;
  skills: string[];
}

export const EMPLOYER_DASHBOARD_STATS: DashboardStat[] = [
  { label: 'Active Jobs', value: 8, delta: '+2 this week', deltaPositive: true },
  { label: 'Applications', value: 124, delta: '+18 this week', deltaPositive: true },
  { label: 'Candidates in Review', value: 31, delta: '9 new today', deltaPositive: true },
  { label: 'Interviews', value: 14, delta: '4 scheduled', deltaPositive: true },
];

export const EMPLOYER_JOB_ROWS: MockJobRow[] = [
  {
    title: 'Senior Frontend Developer',
    location: 'Remote · PH',
    type: 'Full-time',
    applicants: 32,
    status: 'Active',
    postedLabel: 'Posted 2w ago',
  },
  {
    title: 'Product Designer',
    location: 'Makati, PH',
    type: 'Full-time',
    applicants: 18,
    status: 'Active',
    postedLabel: 'Posted 5d ago',
  },
  {
    title: 'Backend Engineer',
    location: 'Remote',
    type: 'Full-time',
    applicants: 24,
    status: 'In Review',
    postedLabel: 'Posted 1w ago',
  },
  {
    title: 'Marketing Specialist',
    location: 'Quezon City, PH',
    type: 'Full-time',
    applicants: 12,
    status: 'Active',
    postedLabel: 'Posted 3d ago',
  },
];

export const HIRING_PIPELINE_STAGES: PipelineStage[] = [
  { label: 'Applicants', count: 124 },
  { label: 'Review', count: 31 },
  { label: 'Interview', count: 14 },
  { label: 'Offer', count: 3 },
];

export const RECENT_APPLICANTS: MockApplicant[] = [
  {
    name: 'Maya Santos',
    headline: 'Senior Frontend Developer · 6 yrs experience',
    initials: 'MS',
    match: 92,
    skills: ['React', 'TypeScript', 'Next.js'],
  },
  {
    name: 'Carlo Reyes',
    headline: 'Product Designer · 4 yrs experience',
    initials: 'CR',
    match: 88,
    skills: ['Figma', 'Design Systems', 'Prototyping'],
  },
];

export const NEW_APPLICATION_PING = {
  title: 'New application',
  body: 'Maya applied to Senior Frontend Developer',
};

export const FREE_POSTING_POINTS = [
  'No posting fee — publish opportunities at zero cost',
  'Easy job creation with a guided listing flow',
  'Reach candidates actively looking for their next role',
  'Build a company presence, not just a listing',
  'Start hiring immediately after publishing',
];

export const HIRRA_ECOSYSTEM_FEATURES = [
  'Job discovery',
  'Company profiles',
  'Company reviews',
  'Career resources',
  'Employer tools',
  'Candidate profiles',
];

export const WHY_POST_BENEFITS = [
  {
    id: 'free-to-start',
    title: "It's Free to Start",
    description:
      'Publish your opportunities without paying a posting fee. Getting started should never depend on your recruiting budget.',
  },
  {
    id: 'reach-candidates',
    title: 'Reach People Looking for Opportunities',
    description:
      'Put your open positions in front of candidates actively exploring their next career move.',
  },
  {
    id: 'company-visibility',
    title: 'Give Your Company Visibility',
    description:
      'Create a company presence where candidates can learn about your organization before they apply.',
  },
  {
    id: 'growing-teams',
    title: 'Built for Growing Teams',
    description:
      "Whether you're a startup hiring your first employee or an established company expanding your team, Hirra gives you a place to start.",
  },
  {
    id: 'show-who-you-are',
    title: 'Show Candidates Who You Are',
    description:
      'Your company is more than a job description. Share context about your culture, workplace, and the people behind it.',
  },
  {
    id: 'keep-it-simple',
    title: 'Keep Hiring Simple',
    description:
      'Create a job, publish it, and start connecting with potential candidates — no unnecessary complexity.',
  },
];

export const STARTUP_STORY_LINES = [
  'You might be hiring your first employee.',
  'You might be building your first engineering team.',
  "You might be opening your business and looking for people who believe in what you're building.",
];

export const NORTHSTAR_COMPANY = {
  name: 'Northstar Technologies',
  industry: 'Software & Technology',
  location: 'Manila, Philippines',
  quote: 'Building tools for the next generation of businesses.',
  employees: '25 people',
  openRoles: 3,
  founded: 'Founded 2023',
  about:
    'Northstar Technologies is a growing software company helping businesses modernize how they operate. The team is hiring across engineering, design, and marketing as they expand across Southeast Asia.',
};

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Create Your Company',
    description:
      'Tell candidates who you are and what your company is building.',
  },
  {
    step: '02',
    title: 'Post Your Job',
    description:
      'Create a clear job listing and publish your opportunity for free.',
  },
  {
    step: '03',
    title: 'Meet Your Next Hire',
    description:
      'Review candidates and connect with people who could become part of your team.',
  },
];

export const COMPANY_PROFILE_OPEN_JOBS = [
  { title: 'Senior Frontend Developer', meta: 'Remote · Full-time' },
  { title: 'Product Designer', meta: 'Makati · Full-time' },
  { title: 'Growth Marketing Lead', meta: 'Manila · Full-time' },
];

export const COMPANY_REVIEWS_SUMMARY = {
  rating: 4.8,
  reviewCount: 27,
  recommendPercentage: 93,
  categoryRatings: [
    { label: 'Culture', value: 4.9 },
    { label: 'Career Growth', value: 4.7 },
    { label: 'Work-Life Balance', value: 4.6 },
  ],
};

export const COMPANY_SAMPLE_REVIEWS = [
  {
    quote:
      'Leadership genuinely listens. I joined as employee #8 and have grown into a lead role in under two years.',
    author: 'Software Engineer',
    employmentStatus: 'Current Employee',
    rating: 5,
  },
  {
    quote:
      'Small team, real ownership. What you build actually ships and matters to customers.',
    author: 'Product Designer',
    employmentStatus: 'Current Employee',
    rating: 4.5,
  },
];

export const AUDIENCE_CARDS = [
  {
    id: 'starting-out',
    icon: 'sprout' as const,
    title: 'Starting Out',
    description: 'Hiring your first employee.',
  },
  {
    id: 'growing',
    icon: 'rocket' as const,
    title: 'Growing',
    description: 'Building your next team.',
  },
  {
    id: 'established',
    icon: 'landmark' as const,
    title: 'Established',
    description: 'Expanding into new roles and departments.',
  },
  {
    id: 'scaling',
    icon: 'globe' as const,
    title: 'Scaling',
    description: 'Finding talent as your company grows.',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'We needed a simple way to get our first roles in front of candidates without adding another major expense.',
    name: 'Andrea Lim',
    role: 'Co-founder',
    company: 'Brightlane Studio',
    initials: 'AL',
  },
  {
    quote:
      'Posting took minutes, not days. We had our first conversations with candidates the same week.',
    name: 'Miguel Torres',
    role: 'Operations Lead',
    company: 'Kapit Café Group',
    initials: 'MT',
  },
  {
    quote:
      "As a small team, we can't compete on brand recognition. A real company profile helped candidates see who we are.",
    name: 'Jasmine Cruz',
    role: 'People & Culture',
    company: 'Northstar Technologies',
    initials: 'JC',
  },
];
