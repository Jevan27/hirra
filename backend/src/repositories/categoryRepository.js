import { prisma } from '../config/prisma.js';

class CategoryRepository {
  async getAll() {
    const categories = await prisma.jobCategory.findMany({
      include: {
        _count: { select: { jobs: { where: { status: 'PUBLISHED' } } } }
      },
      orderBy: { name: 'asc' }
    });

    return categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      jobCount: c._count?.jobs || 0
    }));
  }

  async getById(id) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const category = await prisma.jobCategory.findFirst({
      where: isUuid ? { id } : { slug: id },
      include: {
        _count: { select: { jobs: { where: { status: 'PUBLISHED' } } } }
      }
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      jobCount: category._count?.jobs || 0
    };
  }
}

export const categoryRepository = new CategoryRepository();
