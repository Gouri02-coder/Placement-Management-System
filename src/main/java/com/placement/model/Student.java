package com.placement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Course is required")
    private String course;

    @NotNull(message = "Year is required")
    @Min(value = 1)
    @Max(value = 4)
    private Integer year;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private Double cgpa;

    @NotBlank(message = "Parent email is required")
    @Email(message = "Invalid parent email format")
    @Column(name = "parent_email")
    private String parentEmail;

    @Column(name = "created_date")
    private LocalDate createdDate = LocalDate.now();

    @Column(nullable = false)
    private String role = "student";

    @Column(name = "verified_by_admin", nullable = false)
    private Boolean verifiedByAdmin = false;

    // REMOVED emailVerified field completely

    // Constructors
    public Student() {}

    public Student(String name, String email, String password, String phone, String department, 
                   String course, Integer year, Double cgpa, String parentEmail) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.department = department;
        this.course = course;
        this.year = year;
        this.cgpa = cgpa;
        this.parentEmail = parentEmail;
        this.createdDate = LocalDate.now();
        this.role = "student";
        this.verifiedByAdmin = false;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getVerifiedByAdmin() { return verifiedByAdmin; }
    public void setVerifiedByAdmin(Boolean verifiedByAdmin) { this.verifiedByAdmin = verifiedByAdmin; }

    public boolean isVerifiedByAdmin() { return verifiedByAdmin != null && verifiedByAdmin; }
}