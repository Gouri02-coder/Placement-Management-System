package com.placement.controller;

import com.placement.model.Placement;
import com.placement.service.PlacementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/placements")
@CrossOrigin(origins = "http://localhost:4200")
public class PlacementController {

    @Autowired
    private PlacementService placementService;

    @GetMapping
    public ResponseEntity<List<Placement>> getAllPlacements() {
        List<Placement> placements = placementService.getAllPlacements();
        return ResponseEntity.ok(placements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Placement> getPlacementById(@PathVariable Long id) {
        Optional<Placement> placement = placementService.getPlacementById(id);
        return placement.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPlacement(@Valid @RequestBody Placement placement) {
        try {
            Placement createdPlacement = placementService.createPlacement(placement);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlacement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlacement(@PathVariable Long id, @Valid @RequestBody Placement placement) {
        try {
            Placement updatedPlacement = placementService.updatePlacement(id, placement);
            return ResponseEntity.ok(updatedPlacement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlacement(@PathVariable Long id) {
        try {
            placementService.deletePlacement(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Placement>> getPlacementsByStudent(@PathVariable Long studentId) {
        List<Placement> placements = placementService.getPlacementsByStudent(studentId);
        return ResponseEntity.ok(placements);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Placement>> getPlacementsByJob(@PathVariable Long jobId) {
        List<Placement> placements = placementService.getPlacementsByJob(jobId);
        return ResponseEntity.ok(placements);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Placement>> getPlacementsByStatus(@PathVariable String status) {
        List<Placement> placements = placementService.getPlacementsByStatus(status);
        return ResponseEntity.ok(placements);
    }

    @GetMapping("/check-application")
    public ResponseEntity<Boolean> hasStudentAppliedForJob(
            @RequestParam Long studentId, 
            @RequestParam Long jobId) {
        boolean hasApplied = placementService.hasStudentAppliedForJob(studentId, jobId);
        return ResponseEntity.ok(hasApplied);
    }

    @GetMapping("/stats/selected-count")
    public ResponseEntity<Long> getSelectedPlacementsCount() {
        Long count = placementService.getSelectedPlacementsCount();
        return ResponseEntity.ok(count);
    }
}