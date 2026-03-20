package com.placement.service.impl;

import com.placement.model.Company;
import com.placement.repository.CompanyRepository;
import com.placement.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    @Override
    public Company createCompany(Company company) {
        if (companyRepository.existsByName(company.getName())) {
            throw new RuntimeException("Company with name " + company.getName() + " already exists");
        }
        return companyRepository.save(company);
    }

    @Override
    public Company updateCompany(Long id, Company company) {
        Company existingCompany = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        
        if (!existingCompany.getName().equals(company.getName()) && 
            companyRepository.existsByName(company.getName())) {
            throw new RuntimeException("Company name " + company.getName() + " is already taken");
        }
        
        existingCompany.setName(company.getName());
        existingCompany.setIndustry(company.getIndustry());
        existingCompany.setDescription(company.getDescription());
        existingCompany.setWebsite(company.getWebsite());
        existingCompany.setEmail(company.getEmail());
        existingCompany.setPhone(company.getPhone());
        existingCompany.setAddress(company.getAddress());
        
        return companyRepository.save(existingCompany);
    }

    @Override
    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new RuntimeException("Company not found with id: " + id);
        }
        companyRepository.deleteById(id);
    }

    @Override
    public List<Company> getCompaniesByIndustry(String industry) {
        return companyRepository.findByIndustry(industry);
    }

    @Override
    public List<Company> searchCompaniesByName(String name) {
        return companyRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public boolean existsByName(String name) {
        return companyRepository.existsByName(name);
    }
}