package com.placement.service.impl;

import com.placement.model.Placement;
import com.placement.repository.PlacementRepository;
import com.placement.service.PlacementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlacementServiceImpl implements PlacementService {

    @Autowired
    private PlacementRepository placementRepository;

    @Override
    public List<Placement> getAllPlacements() {
        return placementRepository.findAll();
    }

    @Override
    public Optional<Placement> getPlacementById(Long id) {
        return placementRepository.findById(id);
    }

    @Override
    public Placement createPlacement(Placement placement) {
        // Check if student has already applied for this job
        if (placementRepository.existsByStudentIdAndJobId(
            placement.getStudent().getId(), placement.getJob().getId())) {
            throw new RuntimeException("Student has already applied for this job");
        }
        return placementRepository.save(placement);
    }

    @Override
    public Placement updatePlacement(Long id, Placement placement) {
        Placement existingPlacement = placementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement not found with id: " + id));
        
        existingPlacement.setStatus(placement.getStatus());
        existingPlacement.setInterviewDate(placement.getInterviewDate());
        existingPlacement.setInterviewLocation(placement.getInterviewLocation());
        existingPlacement.setResult(placement.getResult());
        existingPlacement.setFeedback(placement.getFeedback());
        
        return placementRepository.save(existingPlacement);
    }

    @Override
    public void deletePlacement(Long id) {
        if (!placementRepository.existsById(id)) {
            throw new RuntimeException("Placement not found with id: " + id);
        }
        placementRepository.deleteById(id);
    }

    @Override
    public List<Placement> getPlacementsByStudent(Long studentId) {
        return placementRepository.findByStudentId(studentId);
    }

    @Override
    public List<Placement> getPlacementsByJob(Long jobId) {
        return placementRepository.findByJobId(jobId);
    }

    @Override
    public List<Placement> getPlacementsByStatus(String status) {
        return placementRepository.findByStatus(status);
    }

    @Override
    public boolean hasStudentAppliedForJob(Long studentId, Long jobId) {
        return placementRepository.existsByStudentIdAndJobId(studentId, jobId);
    }

    @Override
    public Long getSelectedPlacementsCount() {
        return placementRepository.countSelectedPlacements();
    }
}