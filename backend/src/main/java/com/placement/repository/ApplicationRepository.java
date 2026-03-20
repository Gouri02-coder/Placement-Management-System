package com.placement.repository;

import com.placement.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    // For Student Dashboard: See all jobs they applied to
    List<Application> findByStudentId(Long studentId);
    
    // For Company/PTO Dashboard: See all applicants for a specific job
    List<Application> findByJobId(Long jobId);
    
    // Check if student already applied to prevent duplicate applications
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    
    // For Admin/PTO to filter by status (e.g., find all "SELECTED" students)
    List<Application> findByStatus(String status);
}