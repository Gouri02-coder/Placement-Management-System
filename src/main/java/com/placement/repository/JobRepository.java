package com.placement.repository;

import com.placement.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId);
    List<Job> findByJobType(String jobType);
    List<Job> findByLocation(String location);
    
    @Query("SELECT j FROM Job j WHERE j.applyDeadline >= :currentDate")
    List<Job> findActiveJobs(LocalDate currentDate);
    
    @Query("SELECT j FROM Job j WHERE j.salary BETWEEN :minSalary AND :maxSalary")
    List<Job> findBySalaryRange(Double minSalary, Double maxSalary);
    
    List<Job> findByCompanyNameContainingIgnoreCase(String companyName);
}