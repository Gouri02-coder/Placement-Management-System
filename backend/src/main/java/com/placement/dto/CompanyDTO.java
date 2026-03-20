package com.placement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;

public class CompanyDTO {
    
    @NotBlank(message = "Company name is required")
    private String companyName;
    
    @NotBlank(message = "Industry is required")
    private String industry;
    
    private String description; // Made optional
    
    @NotBlank(message = "Official website is required")
    @Pattern(regexp = "^(https?:\\/\\/)?([\\w\\-]+\\.)+[\\w\\-]{2,}(\\/.*)?$", 
             message = "Please provide a valid website URL")
    private String website;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;
    
    @NotBlank(message = "Contact person name is required")
    private String contactPerson;
    
    @NotBlank(message = "Phone number is required")
    private String phone;
    
    // Getters and Setters
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}