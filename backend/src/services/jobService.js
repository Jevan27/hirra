import { jobRepository } from '../repositories/jobRepository.js';
import { companyRepository } from '../repositories/companyRepository.js';

class JobService {
  async getAllJobs(filters = {}, pagination = {}) {
    const jobs = await jobRepository.findByFilters(filters);
    
    // Enrich with company info
    const companies = await companyRepository.getAll();
    const companyMap = new Map(companies.map(c => [c.id, c]));

    const enrichedJobs = jobs.map(job => ({
      ...job,
      company: companyMap.get(job.companyId) || null
    }));

    // Pagination
    const page = Math.max(1, parseInt(pagination.page, 10) || 1);
    const limit = Math.max(1, parseInt(pagination.limit, 10) || 20);
    const total = enrichedJobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = enrichedJobs.slice(startIndex, startIndex + limit);

    return {
      jobs: paginatedJobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getFeaturedJobs() {
    const featuredJobs = await jobRepository.getFeatured();
    const companies = await companyRepository.getAll();
    const companyMap = new Map(companies.map(c => [c.id, c]));

    return featuredJobs.map(job => ({
      ...job,
      company: companyMap.get(job.companyId) || null
    }));
  }

  async getJobById(id) {
    const job = await jobRepository.getById(id);
    if (!job) return null;

    const company = await companyRepository.getById(job.companyId);
    return {
      ...job,
      company
    };
  }

  async searchJobs(query, location) {
    return this.getAllJobs({ q: query, location });
  }
}

export const jobService = new JobService();
