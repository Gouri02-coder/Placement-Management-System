package com.placement.controller;

import com.placement.model.Application;
import com.placement.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:4200")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // STUDENT: Apply for a job
    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestParam Long studentId, @RequestParam Long jobId) {
        try {
            Application application = applicationService.applyForJob(studentId, jobId);
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // STUDENT: View their applications
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getStudentApplications(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
    }

    // COMPANY/PTO: View all applicants for a specific job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    // COMPANY/PTO: Update student status (Shortlist, Reject, etc.)
    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }

    // PTO: Update attendance during placement drives
    @PutMapping("/{id}/attendance")
    public ResponseEntity<Application> updateAttendance(@PathVariable Long id, @RequestParam String attendance) {
        return ResponseEntity.ok(applicationService.updateAttendance(id, attendance));
    }

    // ADMIN/PTO: View all applications system-wide
    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    // STUDENT: Withdraw application
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> withdrawApplication(@PathVariable Long id) {
        applicationService.withdrawApplication(id);
        return ResponseEntity.noContent().build();
    }
}