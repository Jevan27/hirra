import { jobService } from '../services/jobService.js';

// Safe sanitization helper for pagination
const sanitizePagination = (page, limit) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  return { page: parsedPage, limit: parsedLimit };
};

export const getJobs = async (req, res, next) => {
  try {
    const { 
      q, 
      location, 
      employmentType, 
      workArrangement, 
      category, 
      experienceLevel, 
      minSalary, 
      maxSalary,
      page = 1,
      limit = 20
    } = req.query;

    const safePagination = sanitizePagination(page, limit);

    const result = await jobService.getAllJobs(
      { q, location, employmentType, workArrangement, category, experienceLevel, minSalary, maxSalary },
      safePagination
    );

    res.json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
      message: 'Jobs retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getFeaturedJobs();
    res.json({
      success: true,
      data: jobs,
      message: 'Featured jobs retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobService.getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job with ID '${id}' not found`
      });
    }

    res.json({
      success: true,
      data: job,
      message: 'Job details retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const searchJobs = async (req, res, next) => {
  try {
    const { q, location, page = 1, limit = 20 } = req.query;
    const safePagination = sanitizePagination(page, limit);
    const result = await jobService.getAllJobs({ q, location }, safePagination);

    res.json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
      message: 'Search completed successfully'
    });
  } catch (error) {
    next(error);
  }
};
