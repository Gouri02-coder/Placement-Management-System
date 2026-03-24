package com.placement.service;

import com.placement.model.Placement;
import com.placement.dto.PlacementDTO;

import java.util.List;

public interface PlacementService {
    
    // Create a new placement record
    Placement createPlacement(PlacementDTO placementDTO);
    
    // Get placement by ID
    Placement getPlacementById(Long id);
    
    // Get all placements
    List<Placement> getAllPlacements();
    
    // Get placements by student ID
    List<Placement> getPlacementsByStudentId(Long studentId);
    
    // Get placements by company ID
    List<Placement> getPlacementsByCompanyId(Long companyId);
    
    // Get placements by PTO ID
    List<Placement> getPlacementsByPTOId(Long ptoId);
    
    // Update placement
    Placement updatePlacement(Long id, PlacementDTO placementDTO);
    
    // Delete placement
    void deletePlacement(Long id);
    
    // Get placement statistics
    PlacementStats getPlacementStatistics();
    
    // Inner class for statistics
    class PlacementStats {
        private long totalPlacements;
        private long placedStudents;
        private long pendingPlacements;
        private double averagePackage;
        private String highestPackage;
        
        // Getters and Setters
        public long getTotalPlacements() { return totalPlacements; }
        public void setTotalPlacements(long totalPlacements) { this.totalPlacements = totalPlacements; }
        
        public long getPlacedStudents() { return placedStudents; }
        public void setPlacedStudents(long placedStudents) { this.placedStudents = placedStudents; }
        
        public long getPendingPlacements() { return pendingPlacements; }
        public void setPendingPlacements(long pendingPlacements) { this.pendingPlacements = pendingPlacements; }
        
        public double getAveragePackage() { return averagePackage; }
        public void setAveragePackage(double averagePackage) { this.averagePackage = averagePackage; }
        
        public String getHighestPackage() { return highestPackage; }
        public void setHighestPackage(String highestPackage) { this.highestPackage = highestPackage; }
    }
}