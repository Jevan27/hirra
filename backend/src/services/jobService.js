import { jobRepository } from '../repositories/jobRepository.js';

class JobService {
  async getAllJobs(filters = {}, pagination = {}) {
    const page = Math.max(1, parseInt(pagination.page, 10) || 1);
    const limit = Math.max(1, parseInt(pagination.limit, 10) || 20);

    const { jobs, total } = await jobRepository.findByFilters(filters, { page, limit });

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getFeaturedJobs() {
    return jobRepository.getFeatured();
  }

  async getJobById(id) {
    return jobRepository.getById(id);
  }

  async searchJobs(query, location, pagination = {}) {
    return this.getAllJobs({ q: query, location }, pagination);
  }
}

export const jobService = new JobService();
