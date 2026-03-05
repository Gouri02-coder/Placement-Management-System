package com.placement.service;

import com.placement.model.Placement;
import java.util.List;
import java.util.Optional;

public interface PlacementService {
    List<Placement> getAllPlacements();
    Optional<Placement> getPlacementById(Long id);
    Placement createPlacement(Placement placement);
    Placement updatePlacement(Long id, Placement placement);
    void deletePlacement(Long id);
    List<Placement> getPlacementsByStudent(Long studentId);
    List<Placement> getPlacementsByJob(Long jobId);
    List<Placement> getPlacementsByStatus(String status);
    boolean hasStudentAppliedForJob(Long studentId, Long jobId);
    Long getSelectedPlacementsCount();
}