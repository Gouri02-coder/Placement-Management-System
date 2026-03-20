package com.placement.service;

import com.placement.model.Application;
import java.util.List;

public interface ApplicationService {
    Application applyForJob(Long studentId, Long jobId);
    Application updateApplicationStatus(Long applicationId, String newStatus);
    Application updateAttendance(Long applicationId, String attendanceStatus);
    List<Application> getApplicationsByStudent(Long studentId);
    List<Application> getApplicationsByJob(Long jobId);
    List<Application> getAllApplications();
    void withdrawApplication(Long applicationId);
}