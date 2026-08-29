import { prisma } from '../config/prisma.js';

const formatSalary = (min, max, currency = 'PHP') => {
  if (!min && !max) return null;
  const formatNum = (num) => (num >= 1000 ? `₱${Math.round(num / 1000)}k` : `₱${num}`);
  if (min && max) return `${formatNum(min)} – ${formatNum(max)}/mo`;
  if (min) return `From ${formatNum(min)}/mo`;
  return `Up to ${formatNum(max)}/mo`;
};

const mapWorkArrangement = (val) => {
  if (!val) return 'Hybrid';
  switch (val) {
    case 'REMOTE': return 'Remote';
    case 'ONSITE': return 'On-site';
    case 'HYBRID': return 'Hybrid';
    default: return val;
  }
};

const mapEmploymentType = (val) => {
  if (!val) return 'Full-time';
  switch (val) {
    case 'FULL_TIME': return 'Full-time';
    case 'PART_TIME': return 'Part-time';
    case 'CONTRACT': return 'Contract';
    case 'FREELANCE': return 'Freelance';
    case 'INTERNSHIP': return 'Internship';
    case 'TEMPORARY': return 'Temporary';
    default: return val;
  }
};

const mapExperienceLevel = (val) => {
  if (!val) return 'Mid-Level';
  switch (val) {
    case 'ENTRY_LEVEL': return 'Entry-Level';
    case 'JUNIOR': return 'Junior';
    case 'MID_LEVEL': return 'Mid-Level';
    case 'SENIOR': return 'Senior';
    case 'LEAD': return 'Lead';
    case 'MANAGER': return 'Manager';
    case 'DIRECTOR': return 'Director';
    case 'EXECUTIVE': return 'Executive';
    default: return val;
  }
};

const parseJsonOrLines = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fallback
  }
  return val.split('\n').map(s => s.trim()).filter(Boolean);
};

const formatJob = (job) => {
  if (!job) return null;
  
  const min = job.salaryMin || 0;
  const max = job.salaryMax || 0;
  const currency = job.salaryCurrency || 'PHP';

  const tags = job.skills?.map(js => js.skill.name) || [];

  return {
    id: job.id,
    title: job.title,
    companyId: job.companyId,
    companyName: job.company?.name || 'Company',
    location: job.location || job.company?.city || 'Philippines',
    workArrangement: mapWorkArrangement(job.workplaceType),
    employmentType: mapEmploymentType(job.jobType),
    salary: {
      min,
      max,
      currency,
      period: 'mo',
      formatted: formatSalary(min, max, currency)
    },
    category: job.category?.name || 'Technology',
    experienceLevel: mapExperienceLevel(job.experienceLevel),
    description: job.description,
    responsibilities: parseJsonOrLines(job.responsibilities),
    requirements: parseJsonOrLines(job.requirements),
    benefits: [
      'Comprehensive HMO coverage with dependent subsidy',
      'Flexible working schedule and modern tech setup',
      'Annual performance bonuses and career advancement',
      'Paid learning stipends and professional certifications'
    ],
    tags: tags.length > 0 ? tags : [job.category?.name || 'Technology'],
    postedAt: job.createdAt.toISOString(),
    postedTime: 'Recently',
    featured: true,
    company: job.company ? {
      id: job.company.id,
      name: job.company.name,
      slug: job.company.slug,
      location: job.company.city || job.company.address || 'Philippines',
      website: job.company.website,
      industry: job.company.industry?.name || 'Technology',
      size: job.company.companySize || '500-1000 employees',
      description: job.company.description
    } : null
  };
};

class JobRepository {
  async getAll() {
    const jobs = await prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        company: { include: { industry: true } },
        category: true,
        skills: { include: { skill: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return jobs.map(formatJob);
  }

  async getById(id) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: { include: { industry: true } },
        category: true,
        skills: { include: { skill: true } }
      }
    });
    return formatJob(job);
  }

  async getFeatured() {
    const jobs = await prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        company: { include: { industry: true } },
        category: true,
        skills: { include: { skill: true } }
      },
      take: 6,
      orderBy: { createdAt: 'desc' }
    });
    return jobs.map(formatJob);
  }

  async getByCompanyId(companyId) {
    const jobs = await prisma.job.findMany({
      where: { companyId, status: 'PUBLISHED' },
      include: {
        company: { include: { industry: true } },
        category: true,
        skills: { include: { skill: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return jobs.map(formatJob);
  }

  async findByFilters(filters = {}, pagination = {}) {
    const { q, location, employmentType, workArrangement, category, experienceLevel, minSalary, maxSalary } = filters;
    const where = { status: 'PUBLISHED' };

    if (q && q.trim()) {
      const term = q.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { company: { name: { contains: term, mode: 'insensitive' } } },
        { skills: { some: { skill: { name: { contains: term, mode: 'insensitive' } } } } }
      ];
    }

    if (location && location.trim()) {
      where.location = { contains: location.trim(), mode: 'insensitive' };
    }

    if (employmentType && employmentType !== 'all') {
      const typeMap = {
        'full-time': 'FULL_TIME',
        'part-time': 'PART_TIME',
        'contract': 'CONTRACT',
        'freelance': 'FREELANCE',
        'internship': 'INTERNSHIP'
      };
      const mapped = typeMap[employmentType.toLowerCase()];
      if (mapped) where.jobType = mapped;
    }

    if (workArrangement && workArrangement !== 'all') {
      const arrMap = {
        'remote': 'REMOTE',
        'hybrid': 'HYBRID',
        'on-site': 'ONSITE',
        'onsite': 'ONSITE'
      };
      const mapped = arrMap[workArrangement.toLowerCase()];
      if (mapped) where.workplaceType = mapped;
    }

    if (category && category !== 'all') {
      where.category = {
        name: { contains: category, mode: 'insensitive' }
      };
    }

    if (experienceLevel && experienceLevel !== 'all') {
      const expMap = {
        'entry-level': 'ENTRY_LEVEL',
        'entry': 'ENTRY_LEVEL',
        'junior': 'JUNIOR',
        'mid-level': 'MID_LEVEL',
        'mid': 'MID_LEVEL',
        'senior': 'SENIOR',
        'lead': 'LEAD',
        'manager': 'MANAGER'
      };
      const mapped = expMap[experienceLevel.toLowerCase()];
      if (mapped) where.experienceLevel = mapped;
    }

    if (minSalary) {
      const min = Number(minSalary);
      if (!isNaN(min)) {
        where.salaryMax = { gte: min };
      }
    }

    if (maxSalary) {
      const max = Number(maxSalary);
      if (!isNaN(max)) {
        where.salaryMin = { lte: max };
      }
    }

    const page = Math.max(1, parseInt(pagination.page, 10) || 1);
    const limit = Math.max(1, parseInt(pagination.limit, 10) || 20);
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: { include: { industry: true } },
          category: true,
          skills: { include: { skill: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ]);

    return {
      jobs: jobs.map(formatJob),
      total,
      page,
      limit
    };
  }
}

export const jobRepository = new JobRepository();
