package com.placement.service.impl;

import com.placement.model.Company;
import com.placement.repository.CompanyRepository;
import com.placement.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

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
        if (companyRepository.existsByName(company.getCompanyName())) {
            throw new RuntimeException("Company with name " + company.getCompanyName() + " already exists");
        }
        if (companyRepository.existsByEmail(company.getEmail())) {
            throw new RuntimeException("Email already exists: " + company.getEmail());
        }
        
        company.setPassword(passwordEncoder.encode(company.getPassword()));
        // Set default verification status
        company.setVerifiedByAdmin(false);
        return companyRepository.save(company);
    }

    @Override
    public Company updateCompany(Long id, Company company) {
        Company existingCompany = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        
        if (!existingCompany.getCompanyName().equals(company.getCompanyName()) && 
            companyRepository.existsByName(company.getCompanyName())) {
            throw new RuntimeException("Company name " + company.getCompanyName() + " is already taken");
        }
        
        existingCompany.setName(company.getName());
        existingCompany.setCompanyName(company.getCompanyName());
        existingCompany.setIndustry(company.getIndustry());
        existingCompany.setDescription(company.getDescription());
        existingCompany.setWebsite(company.getWebsite());
        existingCompany.setEmail(company.getEmail());
        existingCompany.setPhone(company.getPhone());
        existingCompany.setAddress(company.getAddress());
        existingCompany.setCompanySize(company.getCompanySize());
        
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
    
    // ============ ADDED VERIFICATION METHODS ============
    
    @Override
    public List<Company> getUnverifiedCompanies() {
        return companyRepository.findByVerifiedByAdminFalse();
    }
    
    @Override
    public List<Company> getVerifiedCompanies() {
        return companyRepository.findByVerifiedByAdminTrue();
    }
    
    @Override
    @Transactional
    public void verifyCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        company.setVerifiedByAdmin(true);
        companyRepository.save(company);
    }
    
    @Override
    @Transactional
    public void rejectCompany(Long companyId, String reason) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        companyRepository.delete(company);
        System.out.println("Company " + company.getCompanyName() + " rejected. Reason: " + reason);
    }
    
    @Override
    public long countAllCompanies() {
        return companyRepository.count();
    }
    
    @Override
    public long countVerifiedCompanies() {
        return companyRepository.countByVerifiedByAdminTrue();
    }
    
    @Override
    public long countUnverifiedCompanies() {
        return companyRepository.countByVerifiedByAdminFalse();
    }
    
    @Override
    public List<Object[]> getIndustryWiseStats() {
        return companyRepository.countCompaniesByIndustry();
    }
}