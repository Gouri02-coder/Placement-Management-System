package com.placement.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for Job Entity.
 * Includes eligibility fields as per Goal #7 of the Placement System.
 */
public class JobDTO {
    private Long id;

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Requirements are required")
    private String requirements;

    @NotNull(message = "Salary is required")
    private BigDecimal salary;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Job type is required")
    private String jobType;

    @NotNull(message = "Openings count is required")
    @Min(value = 1, message = "Openings must be at least 1")
    private Integer openings;

    @NotNull(message = "Apply deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDate applyDeadline;

    private LocalDate postedDate;

    // ELIGIBILITY FIELDS (Goal #7)
    @NotNull(message = "Minimum CGPA requirement is required")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private Double minCgpa;

    @NotBlank(message = "Target department is required")
    private String targetDepartment;

    // RELATIONSHIP FIELDS
    private Long companyId;
    private String companyName;

    // Constructors
    public JobDTO() {}

    public JobDTO(Long id, String title, String description, String requirements, 
                 BigDecimal salary, String location, String jobType, Integer openings, 
                 LocalDate applyDeadline, LocalDate postedDate, Double minCgpa, 
                 String targetDepartment, Long companyId, String companyName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.salary = salary;
        this.location = location;
        this.jobType = jobType;
        this.openings = openings;
        this.applyDeadline = applyDeadline;
        this.postedDate = postedDate;
        this.minCgpa = minCgpa;
        this.targetDepartment = targetDepartment;
        this.companyId = companyId;
        this.companyName = companyName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public Integer getOpenings() { return openings; }
    public void setOpenings(Integer openings) { this.openings = openings; }

    public LocalDate getApplyDeadline() { return applyDeadline; }
    public void setApplyDeadline(LocalDate applyDeadline) { this.applyDeadline = applyDeadline; }

    public LocalDate getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDate postedDate) { this.postedDate = postedDate; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public String getTargetDepartment() { return targetDepartment; }
    public void setTargetDepartment(String targetDepartment) { this.targetDepartment = targetDepartment; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}