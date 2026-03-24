package com.placement.repository;

import com.placement.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    List<Job> findByCompanyId(Long companyId);
    
    List<Job> findByJobType(String jobType);
    
    List<Job> findByLocation(String location);

    // Goal #7: Eligibility filtering
    @Query("SELECT j FROM Job j WHERE j.applyDeadline >= :date AND j.minCgpa <= :cgpa AND j.targetDepartment = :dept")
    List<Job> findEligibleJobs(@Param("date") LocalDate date, @Param("cgpa") Double cgpa, @Param("dept") String dept);

    @Query("SELECT j FROM Job j WHERE j.applyDeadline >= :currentDate")
    List<Job> findActiveJobs(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT j FROM Job j WHERE j.salary BETWEEN :minSalary AND :maxSalary")
    List<Job> findBySalaryRange(@Param("minSalary") Double minSalary, @Param("maxSalary") Double maxSalary);

    List<Job> findByCompanyNameContainingIgnoreCase(String companyName);
}