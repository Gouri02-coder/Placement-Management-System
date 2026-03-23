// src/main/java/com/placement/service/UserManagementService.java
package com.placement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserManagementService {
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private CompanyService companyService;
    
    // Get all pending verifications
    @Transactional(readOnly = true)
    public Map<String, Object> getPendingVerifications() {
        Map<String, Object> result = new HashMap<>();
        result.put("students", studentService.getUnverifiedStudents());
        result.put("companies", companyService.getUnverifiedCompanies());
        result.put("totalPending", studentService.countUnverifiedStudents() + 
                                  companyService.countUnverifiedCompanies());
        return result;
    }
    
    // Verify a user
    @Transactional
    public void verifyUser(String userType, Long userId) {
        if ("student".equalsIgnoreCase(userType)) {
            studentService.verifyStudent(userId);
        } else if ("company".equalsIgnoreCase(userType)) {
            companyService.verifyCompany(userId);
        } else {
            throw new IllegalArgumentException("Invalid user type: " + userType);
        }
    }
    
    // Get dashboard statistics
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Student statistics
        long totalStudents = studentService.countAllStudents();
        long verifiedStudents = studentService.countVerifiedStudents();
        long unverifiedStudents = studentService.countUnverifiedStudents();
        
        // Company statistics
        long totalCompanies = companyService.countAllCompanies();
        long verifiedCompanies = companyService.countVerifiedCompanies();
        long unverifiedCompanies = companyService.countUnverifiedCompanies();
        
        // Department and industry stats
        stats.put("departmentStats", studentService.getDepartmentWiseStats());
        stats.put("industryStats", companyService.getIndustryWiseStats());
        stats.put("courseStats", studentService.getCourseWiseStats());
        stats.put("yearStats", studentService.getYearWiseStats());
        
        // Basic stats
        stats.put("totalStudents", totalStudents);
        stats.put("verifiedStudents", verifiedStudents);
        stats.put("unverifiedStudents", unverifiedStudents);
        
        stats.put("totalCompanies", totalCompanies);
        stats.put("verifiedCompanies", verifiedCompanies);
        stats.put("unverifiedCompanies", unverifiedCompanies);
        
        stats.put("studentVerificationRate", totalStudents > 0 ? 
            (double) verifiedStudents / totalStudents * 100 : 0);
        stats.put("companyVerificationRate", totalCompanies > 0 ? 
            (double) verifiedCompanies / totalCompanies * 100 : 0);
        
        stats.put("totalUsers", totalStudents + totalCompanies);
        stats.put("pendingVerifications", unverifiedStudents + unverifiedCompanies);
        
        return stats;
    }
}