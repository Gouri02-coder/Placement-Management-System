package com.placement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Column(length = 2000)
    private String description;

    @NotBlank(message = "Requirements are required")
    @Column(length = 1000)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    // Constructors
    public Job() {
        this.postedDate = LocalDate.now();
    }

    public Job(String title, String description, String requirements, BigDecimal salary, 
               String location, String jobType, Integer openings, LocalDate applyDeadline) {
        this();
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.salary = salary;
        this.location = location;
        this.jobType = jobType;
        this.openings = openings;
        this.applyDeadline = applyDeadline;
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

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
}