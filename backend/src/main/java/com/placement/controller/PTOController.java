package com.placement.controller;

import com.placement.model.GPSLog;
import com.placement.repository.GPSLogRepository;
import com.placement.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pto")
@PreAuthorize("hasAuthority('PTO')")
public class PTOController {

    @Autowired
    private GPSLogRepository gpsLogRepository;

    @Autowired
    private EmailService emailService;

    // --- Original Endpoints ---

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard() {
        return ResponseEntity.ok("Welcome to PTO Dashboard");
    }

    @GetMapping("/profile")
    public ResponseEntity<String> getProfile() {
        return ResponseEntity.ok("PTO Profile Information");
    }

    @GetMapping("/drives")
    public ResponseEntity<String> getDrives() {
        return ResponseEntity.ok("List of all placement drives");
    }

    @GetMapping("/students")
    public ResponseEntity<String> getStudents() {
        return ResponseEntity.ok("List of all registered students");
    }

    @GetMapping("/companies")
    public ResponseEntity<String> getCompanies() {
        return ResponseEntity.ok("List of all registered companies");
    }

    @GetMapping("/placements")
    public ResponseEntity<String> getPlacements() {
        return ResponseEntity.ok("Placement records and statistics");
    }

    // --- NEW: GPS Tracker Endpoint ---

    @PostMapping("/log-location")
    public ResponseEntity<String> logLocation(@RequestParam String email, 
                                            @RequestParam Double lat, 
                                            @RequestParam Double lon) {
        GPSLog log = new GPSLog();
        log.setPtoEmail(email);
        log.setLatitude(lat);
        log.setLongitude(lon);
        log.setTimestamp(LocalDateTime.now());
        
        gpsLogRepository.save(log);
        return ResponseEntity.ok("PTO Location logged successfully at " + log.getTimestamp());
    }

    // --- NEW: Email Notification Endpoint ---
    // This allows the PTO to notify a parent about a student's placement status
    
    @PostMapping("/notify-parent")
    public ResponseEntity<String> notifyParent(@RequestParam String parentEmail, 
                                              @RequestParam String studentName, 
                                              @RequestParam String status) {
        
        String subject = "Placement Portal Update for " + studentName;
        String body = "Dear Parent,\n\nThis is to inform you that " + studentName + 
                      " currently has a placement status of: " + status + 
                      ".\n\nRegards,\nPlacement Office";

        emailService.sendEmail(parentEmail, subject, body);
        return ResponseEntity.ok("Email notification sent to " + parentEmail);
    }
}