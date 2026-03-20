package com.placement.service;

import com.placement.model.Company;
import java.util.List;
import java.util.Optional;

public interface CompanyService {
    List<Company> getAllCompanies();
    Optional<Company> getCompanyById(Long id);
    Company createCompany(Company company);
    Company updateCompany(Long id, Company company);
    void deleteCompany(Long id);
    List<Company> getCompaniesByIndustry(String industry);
    List<Company> searchCompaniesByName(String name);
    boolean existsByName(String name);
    
    // ADD THESE VERIFICATION METHODS
    List<Company> getUnverifiedCompanies();
    List<Company> getVerifiedCompanies();
    void verifyCompany(Long companyId);
    void rejectCompany(Long companyId, String reason);
    long countAllCompanies();
    long countVerifiedCompanies();
    long countUnverifiedCompanies();
    
    // ADD THESE FOR DASHBOARD
    List<Object[]> getIndustryWiseStats();
}