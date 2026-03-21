package com.placement.service;

import com.placement.model.Placement;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Optional;

public interface PlacementService {
    List<Placement> getAllPlacements();
    Optional<Placement> getPlacementById(@NonNull Long id);
    Placement createPlacement(Placement placement);
    Placement updatePlacement(@NonNull Long id, Placement placement);
    void deletePlacement(@NonNull Long id);
    List<Placement> getPlacementsByStudent(@NonNull Long studentId);
    List<Placement> getPlacementsByJob(@NonNull Long jobId);
    List<Placement> getPlacementsByStatus(String status);
    boolean hasStudentAppliedForJob(@NonNull Long studentId, @NonNull Long jobId);
    Long getSelectedPlacementsCount();
}