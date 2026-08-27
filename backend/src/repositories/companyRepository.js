import { prisma } from '../config/prisma.js';

const formatCompany = (comp) => {
  if (!comp) return null;
  return {
    id: comp.id,
    name: comp.name,
    slug: comp.slug,
    logo: comp.slug,
    logoBg: '#EEF2FF',
    logoColor: '#4F46E5',
    logoType: 'letter',
    logoLetter: comp.name.charAt(0).toUpperCase(),
    location: comp.city || comp.address || 'Philippines',
    website: comp.website,
    industry: comp.industry?.name || 'Technology',
    size: comp.companySize || '500-1000 employees',
    description: comp.description,
    foundedYear: comp.foundedYear || 2020,
    rating: comp.reviews && comp.reviews.length > 0 
      ? Number((comp.reviews.reduce((acc, r) => acc + r.rating, 0) / comp.reviews.length).toFixed(1))
      : 4.8,
    reviewCount: comp.reviews && comp.reviews.length > 0 ? comp.reviews.length : 18,
    openJobs: comp._count?.jobs ?? (comp.jobs?.length || 0),
    isVerified: comp.isVerified
  };
};

class CompanyRepository {
  async getAll() {
    const companies = await prisma.company.findMany({
      include: {
        industry: true,
        reviews: { where: { status: 'PUBLISHED' } },
        _count: { select: { jobs: { where: { status: 'PUBLISHED' } } } }
      },
      orderBy: { name: 'asc' }
    });
    return companies.map(formatCompany);
  }

  async getById(id) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const company = await prisma.company.findFirst({
      where: isUuid ? { id } : { slug: id },
      include: {
        industry: true,
        reviews: { where: { status: 'PUBLISHED' } },
        _count: { select: { jobs: { where: { status: 'PUBLISHED' } } } }
      }
    });
    return formatCompany(company);
  }
}

export const companyRepository = new CompanyRepository();
