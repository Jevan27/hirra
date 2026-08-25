import { categoryRepository } from '../repositories/categoryRepository.js';
import { jobRepository } from '../repositories/jobRepository.js';

class CategoryService {
  async getAllCategories() {
    const categories = await categoryRepository.getAll();
    const jobs = await jobRepository.getAll();

    return categories.map(cat => {
      const count = jobs.filter(j => 
        j.category?.toLowerCase().includes(cat.slug.toLowerCase()) || 
        cat.slug.toLowerCase().includes(j.category?.toLowerCase())
      ).length;
      return {
        ...cat,
        jobCount: count > 0 ? count : cat.jobCount
      };
    });
  }

  async getCategoryById(id) {
    return categoryRepository.getById(id);
  }
}

export const categoryService = new CategoryService();
