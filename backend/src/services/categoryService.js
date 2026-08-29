import { categoryRepository } from '../repositories/categoryRepository.js';

class CategoryService {
  async getAllCategories() {
    return categoryRepository.getAll();
  }

  async getCategoryById(id) {
    return categoryRepository.getById(id);
  }
}

export const categoryService = new CategoryService();
