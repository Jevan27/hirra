import { companyRepository } from '../repositories/companyRepository.js';
import { jobRepository } from '../repositories/jobRepository.js';

class CompanyService {
  async getAllCompanies() {
    return companyRepository.getAll();
  }

  async getCompanyById(id) {
    const company = await companyRepository.getById(id);
    if (!company) return null;

    const companyJobs = await jobRepository.getByCompanyId(company.id);

    return {
      ...company,
      activeJobs: companyJobs
    };
  }
}

export const companyService = new CompanyService();
