package com.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.placement.model.Placement;

@Repository
public interface PlacementRepository extends JpaRepository<Placement, Long> {
    List<Placement> findByStudentId(Long studentId);
    List<Placement> findByJobId(Long jobId);
    List<Placement> findByStatus(String status);
    
    @Query("SELECT p FROM Placement p WHERE p.student.id = :studentId AND p.job.id = :jobId")
    Optional<Placement> findByStudentAndJob(Long studentId, Long jobId);
    
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    
    @Query("SELECT COUNT(p) FROM Placement p WHERE p.status = 'SELECTED'")
    Long countSelectedPlacements();

    @Query("SELECT p FROM Placement p WHERE p.job.company.id = :companyId")
    List<Placement> findByJobCompanyId(Long companyId);
}