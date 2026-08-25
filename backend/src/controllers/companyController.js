import { companyService } from '../services/companyService.js';

export const getCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.json({
      success: true,
      data: companies,
      message: 'Companies retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await companyService.getCompanyById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: `Company with ID '${id}' not found`
      });
    }

    res.json({
      success: true,
      data: company,
      message: 'Company retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};
