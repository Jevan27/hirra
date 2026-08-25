import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMPANIES_FILE = path.join(__dirname, '../data/companies.json');

class CompanyRepository {
  async getAll() {
    const raw = await fs.readFile(COMPANIES_FILE, 'utf-8');
    return JSON.parse(raw);
  }

  async getById(id) {
    const companies = await this.getAll();
    return companies.find(c => c.id === id || c.slug === id) || null;
  }
}

export const companyRepository = new CompanyRepository();
