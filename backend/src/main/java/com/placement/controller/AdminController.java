// src/main/java/com/placement/controller/AdminController.java
package com.placement.controller;

import com.placement.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private UserManagementService userManagementService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private CompanyService companyService;
    
    @Autowired
    private JobService jobService;
    
    @Autowired
    private PlacementService placementService;
    
    // ==================== DASHBOARD STATISTICS ====================
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = userManagementService.getDashboardStatistics();
        
        // Add job stats
        try {
            long totalJobs = 0;
            if (jobService != null) {
                try {
                    totalJobs = jobService.getAllJobs().size();
                } catch (Exception e) {
                    totalJobs = 0;
                }
            }
            stats.put("totalJobs", totalJobs);
        } catch (Exception e) {
            stats.put("totalJobs", 0);
        }
        
        // Add placement stats
        stats.put("placedStudents", 0);
        stats.put("placementRate", 0.0);
        
        return ResponseEntity.ok(stats);
    }
    
    // ==================== PENDING VERIFICATIONS ====================
    @GetMapping("/pending-verifications")
    public ResponseEntity<Map<String, Object>> getPendingVerifications() {
        return ResponseEntity.ok(userManagementService.getPendingVerifications());
    }
    
    // ==================== VERIFY USER ====================
    @PostMapping("/verify/{userType}/{userId}")
    public ResponseEntity<Map<String, Object>> verifyUser(
            @PathVariable String userType,
            @PathVariable Long userId) {
        
        userManagementService.verifyUser(userType, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", userType + " verified successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // ==================== REJECT USER ====================
    @DeleteMapping("/reject/{userType}/{userId}")
    public ResponseEntity<Map<String, Object>> rejectUser(
            @PathVariable String userType,
            @PathVariable Long userId,
            @RequestBody(required = false) Map<String, String> request) {
        
        String reason = request != null ? request.get("reason") : "No reason provided";
        
        if ("student".equalsIgnoreCase(userType)) {
            studentService.rejectStudent(userId, reason);
        } else if ("company".equalsIgnoreCase(userType)) {
            companyService.rejectCompany(userId, reason);
        } else {
            throw new IllegalArgumentException("Invalid user type: " + userType);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", userType + " rejected");
        
        return ResponseEntity.ok(response);
    }
    
    // ==================== STUDENT MANAGEMENT ====================
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(
            @RequestParam(required = false) Boolean verified,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year) {
        
        if (verified != null) {
            return ResponseEntity.ok(
                verified ? studentService.getVerifiedStudents() : 
                          studentService.getUnverifiedStudents()
            );
        }
        
        if (department != null && !department.isEmpty()) {
            return ResponseEntity.ok(studentService.getStudentsByDepartment(department));
        }
        
        if (year != null) {
            return ResponseEntity.ok(studentService.getStudentsByYear(year));
        }
        
        return ResponseEntity.ok(studentService.getAllStudents());
    }
    
    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getStudentDetails(@PathVariable Long studentId) {
        return studentService.getStudentById(studentId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // ==================== COMPANY MANAGEMENT ====================
    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies(
            @RequestParam(required = false) Boolean verified,
            @RequestParam(required = false) String industry) {
        
        if (verified != null) {
            return ResponseEntity.ok(
                verified ? companyService.getVerifiedCompanies() : 
                          companyService.getUnverifiedCompanies()
            );
        }
        
        if (industry != null && !industry.isEmpty()) {
            return ResponseEntity.ok(companyService.getCompaniesByIndustry(industry));
        }
        
        return ResponseEntity.ok(companyService.getAllCompanies());
    }
    
    @GetMapping("/companies/{companyId}")
    public ResponseEntity<?> getCompanyDetails(@PathVariable Long companyId) {
        return companyService.getCompanyById(companyId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // ==================== SYSTEM INFO ====================
    @GetMapping("/system/info")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("status", "UP");
        info.put("timestamp", System.currentTimeMillis());
        info.put("version", "1.0.0");
        
        return ResponseEntity.ok(info);
    }
}