package com.placement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Contact person name is required")
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

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Industry is required")
    private String industry;

    private String website;

    @NotBlank(message = "Company size is required")
    private String companySize;

    @NotBlank(message = "Address is required")
    private String address;

    private String description;

    @Column(name = "created_date")
    private LocalDate createdDate = LocalDate.now();

    @Column(nullable = false)
    private String role = "company";

    @Column(name = "verified_by_admin", nullable = false)
    private Boolean verifiedByAdmin = false;

    // REMOVED emailVerified field

    // Constructors
    public Company() {}

    public Company(String name, String email, String password, String phone, String companyName) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.companyName = companyName;
        this.createdDate = LocalDate.now();
        this.role = "company";
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

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getCompanySize() { return companySize; }
    public void setCompanySize(String companySize) { this.companySize = companySize; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getVerifiedByAdmin() { return verifiedByAdmin; }
    public void setVerifiedByAdmin(Boolean verifiedByAdmin) { this.verifiedByAdmin = verifiedByAdmin; }
    
    public boolean isVerifiedByAdmin() { 
        return verifiedByAdmin != null && verifiedByAdmin; 
    }
}