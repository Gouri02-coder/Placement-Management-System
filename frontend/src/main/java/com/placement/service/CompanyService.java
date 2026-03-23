package com.placement.service;

import com.placement.model.Company;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Optional;

public interface CompanyService {
    List<Company> getAllCompanies();
    Optional<Company> getCompanyById(@NonNull Long id);
    Company createCompany(Company company);
    Company updateCompany(@NonNull Long id, Company company);
    void deleteCompany(@NonNull Long id);
    List<Company> getCompaniesByIndustry(String industry);
    List<Company> searchCompaniesByName(String name);
    boolean existsByName(String name);
}