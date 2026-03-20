package com.placement.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class PlacementDTO {
    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private LocalDate applicationDate;
    private String status;
    private LocalDate interviewDate;
    private String interviewLocation;
    private String result;
    private String feedback;

    // Additional fields for display
    private String studentName;
    private String studentEmail;
    private String jobTitle;
    private String companyName;

    // Constructors
    public PlacementDTO() {}

    public PlacementDTO(Long id, Long studentId, Long jobId, LocalDate applicationDate, 
                       String status, LocalDate interviewDate, String interviewLocation, 
                       String result, String feedback) {
        this.id = id;
        this.studentId = studentId;
        this.jobId = jobId;
        this.applicationDate = applicationDate;
        this.status = status;
        this.interviewDate = interviewDate;
        this.interviewLocation = interviewLocation;
        this.result = result;
        this.feedback = feedback;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public LocalDate getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDate applicationDate) { this.applicationDate = applicationDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDate interviewDate) { this.interviewDate = interviewDate; }

    public String getInterviewLocation() { return interviewLocation; }
    public void setInterviewLocation(String interviewLocation) { this.interviewLocation = interviewLocation; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}