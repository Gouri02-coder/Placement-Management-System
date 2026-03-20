package com.placement.service.impl;

import com.placement.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private CompanyService companyService;
    
    @Autowired
    private JobService jobService;
    
    @Autowired
    private PlacementService placementService;
    
    @Override
    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get user management stats
        Map<String, Object> userStats = new HashMap<>();
        try {
            // You need to create a UserManagementService or get stats directly
            UserManagementService userManagementService = null; // This should be autowired
            
            // For now, get stats directly from services
            long totalStudents = studentService.countAllStudents();
            long totalCompanies = companyService.countAllCompanies();
            
            stats.put("totalStudents", totalStudents);
            stats.put("totalCompanies", totalCompanies);
            stats.put("pendingVerifications", 0); // Will be updated by UserManagementService
            
        } catch (Exception e) {
            // Default values
            stats.put("totalStudents", 0);
            stats.put("totalCompanies", 0);
            stats.put("pendingVerifications", 0);
        }
        
        // Add job stats
        try {
            long totalJobs = 0;
            // Check if jobService has count method
            try {
                // If your JobService has getAllJobs method
                totalJobs = jobService.getAllJobs().size();
            } catch (Exception e) {
                totalJobs = 0;
            }
            stats.put("totalJobs", totalJobs);
        } catch (Exception e) {
            stats.put("totalJobs", 0);
        }
        
        // Add placement stats
        stats.put("placedStudents", 0);
        stats.put("placementRate", 0.0);
        
        return stats;
    }
}