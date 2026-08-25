import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATEGORIES_FILE = path.join(__dirname, '../data/categories.json');

class CategoryRepository {
  async getAll() {
    const raw = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(raw);
  }

  async getById(id) {
    const categories = await this.getAll();
    return categories.find(c => c.id === id || c.slug === id) || null;
  }
}

export const categoryRepository = new CategoryRepository();
