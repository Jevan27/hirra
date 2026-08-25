import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JOBS_FILE = path.join(__dirname, '../data/jobs.json');

class JobRepository {
  async getAll() {
    const raw = await fs.readFile(JOBS_FILE, 'utf-8');
    return JSON.parse(raw);
  }

  async getById(id) {
    const jobs = await this.getAll();
    return jobs.find(job => job.id === id) || null;
  }

  async getFeatured() {
    const jobs = await this.getAll();
    return jobs.filter(job => job.featured === true);
  }

  async findByFilters({ q, location, employmentType, workArrangement, category, experienceLevel, minSalary, maxSalary }) {
    let jobs = await this.getAll();

    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(term) ||
        job.companyName.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        (job.tags && job.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    if (location && location.trim()) {
      const locTerm = location.trim().toLowerCase();
      jobs = jobs.filter(job => job.location.toLowerCase().includes(locTerm));
    }

    if (employmentType && employmentType !== 'all') {
      const types = Array.isArray(employmentType) ? employmentType : [employmentType];
      jobs = jobs.filter(job => types.some(t => job.employmentType.toLowerCase() === t.toLowerCase()));
    }

    if (workArrangement && workArrangement !== 'all') {
      const arrangements = Array.isArray(workArrangement) ? workArrangement : [workArrangement];
      jobs = jobs.filter(job => arrangements.some(a => job.workArrangement.toLowerCase() === a.toLowerCase()));
    }

    if (category && category !== 'all') {
      const cats = Array.isArray(category) ? category : [category];
      jobs = jobs.filter(job => cats.some(c => job.category.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(job.category.toLowerCase())));
    }

    if (experienceLevel && experienceLevel !== 'all') {
      const levels = Array.isArray(experienceLevel) ? experienceLevel : [experienceLevel];
      jobs = jobs.filter(job => levels.some(l => job.experienceLevel.toLowerCase() === l.toLowerCase()));
    }

    if (minSalary) {
      const min = Number(minSalary);
      if (!isNaN(min)) {
        jobs = jobs.filter(job => job.salary?.max >= min);
      }
    }

    if (maxSalary) {
      const max = Number(maxSalary);
      if (!isNaN(max)) {
        jobs = jobs.filter(job => job.salary?.min <= max);
      }
    }

    return jobs;
  }
}

export const jobRepository = new JobRepository();
