package com.placement.repository;

import com.placement.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
 
    Optional<Company> findByEmail(String email);  
    boolean existsByEmail(String email);          
    Optional<Company> findByName(String name);
    List<Company> findByIndustry(String industry);
    List<Company> findByNameContainingIgnoreCase(String name);
    boolean existsByName(String name);
    
    // ADD THESE VERIFICATION METHODS
    List<Company> findByVerifiedByAdminFalse();
    List<Company> findByVerifiedByAdminTrue();
    long countByVerifiedByAdminTrue();
    long countByVerifiedByAdminFalse();
    
    // ADD THESE FOR DASHBOARD STATS
    @Query("SELECT c.industry, COUNT(c) FROM Company c GROUP BY c.industry")
    List<Object[]> countCompaniesByIndustry();
}