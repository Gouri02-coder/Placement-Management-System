package com.placement.service.impl;

import com.placement.model.Placement;
import com.placement.repository.PlacementRepository;
import com.placement.service.PlacementService;
import com.placement.dto.PlacementDTO;
import com.placement.repository.StudentRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.CompanyRepository;
import com.placement.repository.PTORepository;
import com.placement.model.Student;
import com.placement.model.Job;
import com.placement.model.Company;
import com.placement.model.PTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlacementServiceImpl implements PlacementService {

    @Autowired
    private PlacementRepository placementRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PTORepository ptoRepository;

    @Override
    public Placement createPlacement(PlacementDTO placementDTO) {
        // Fetch student and job
        Student student = studentRepository.findById(placementDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Job job = jobRepository.findById(placementDTO.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if student has already applied for this job
        if (placementRepository.existsByStudentIdAndJobId(student.getId(), job.getId())) {
            throw new RuntimeException("Student has already applied for this job");
        }

        Placement placement = new Placement(student, job);
        placement.setStatus(placementDTO.getStatus());
        placement.setInterviewDate(placementDTO.getInterviewDate());
        placement.setInterviewLocation(placementDTO.getInterviewLocation());
        placement.setResult(placementDTO.getResult());
        placement.setFeedback(placementDTO.getFeedback());

        return placementRepository.save(placement);
    }

    @Override
    public Placement getPlacementById(Long id) {
        return placementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement not found with id: " + id));
    }

    @Override
    public List<Placement> getAllPlacements() {
        return placementRepository.findAll();
    }

    @Override
    public List<Placement> getPlacementsByStudentId(Long studentId) {
        return placementRepository.findByStudentId(studentId);
    }

    @Override
    public List<Placement> getPlacementsByCompanyId(Long companyId) {
        // Assuming we add a method in repository
        return placementRepository.findByJobCompanyId(companyId);
    }

    @Override
    public List<Placement> getPlacementsByPTOId(Long ptoId) {
        // Assuming PTO has placements, but for now, return empty or implement
        return List.of(); // Placeholder
    }

    @Override
    public Placement updatePlacement(Long id, PlacementDTO placementDTO) {
        Placement existingPlacement = placementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement not found with id: " + id));
        
        existingPlacement.setStatus(placementDTO.getStatus());
        existingPlacement.setInterviewDate(placementDTO.getInterviewDate());
        existingPlacement.setInterviewLocation(placementDTO.getInterviewLocation());
        existingPlacement.setResult(placementDTO.getResult());
        existingPlacement.setFeedback(placementDTO.getFeedback());
        
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
    public PlacementStats getPlacementStatistics() {
        PlacementStats stats = new PlacementStats();
        // Implement statistics calculation
        stats.setTotalPlacements(placementRepository.count());
        // Add more calculations as needed
        return stats;
    }
}