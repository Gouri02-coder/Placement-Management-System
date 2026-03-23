package com.placement.controller;

import com.placement.model.*;
import com.placement.repository.*;
import com.placement.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PTORepository ptoRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for email: " + request.getEmail());
            
            String email = request.getEmail();
            
            // Check in all repositories
            Optional<Student> studentOpt = studentRepository.findByEmail(email);
            Optional<Company> companyOpt = companyRepository.findByEmail(email);
            Optional<PTO> ptoOpt = ptoRepository.findByEmail(email);
            Optional<Admin> adminOpt = adminRepository.findByEmail(email);
            
            Object user = null;
            String role = null;
            Long userId = null;
            String name = null;
            
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                user = admin;
                role = admin.getRole();
                userId = admin.getId();
                name = admin.getName();
                System.out.println("Admin found: " + admin.getEmail());
            } 
            else if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                user = student;
                role = student.getRole();
                userId = student.getId();
                name = student.getName();
                System.out.println("Student found: " + student.getEmail());
            }
            else if (companyOpt.isPresent()) {
                Company company = companyOpt.get();
                user = company;
                role = company.getRole();
                userId = company.getId();
                name = company.getName();
                System.out.println("Company found: " + company.getEmail());
            }
            else if (ptoOpt.isPresent()) {
                PTO pto = ptoOpt.get();
                user = pto;
                role = pto.getRole();
                userId = pto.getId();
                name = pto.getName();
                System.out.println("PTO found: " + pto.getEmail());
            }
            else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                error.put("status", "error");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            // Authenticate with Spring Security
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
                );
                System.out.println("Authentication successful");
            } catch (BadCredentialsException e) {
                System.out.println("Bad credentials");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid email or password");
                error.put("status", "error");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            // Generate token
            String token = jwtUtil.generateToken(email, role);
            String refreshToken = jwtUtil.generateRefreshToken(email);

            // Build response
            Map<String, Object> loginResponse = new HashMap<>();
            
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", userId.toString());
            userMap.put("email", email);
            userMap.put("name", name);
            userMap.put("role", role);
            
            loginResponse.put("user", userMap);
            loginResponse.put("token", token);
            loginResponse.put("refreshToken", refreshToken);
            loginResponse.put("expiresIn", 86400000);
            loginResponse.put("status", "success");
            
            // Set redirect URL based on role
            switch(role.toLowerCase()) {
                case "admin":
                    loginResponse.put("redirectUrl", "/admin");
                    break;
                case "pto":
                    loginResponse.put("redirectUrl", "/placement");
                    break;
                case "company":
                    loginResponse.put("redirectUrl", "/company");
                    break;
                case "student":
                    loginResponse.put("redirectUrl", "/student");
                    break;
                default:
                    loginResponse.put("redirectUrl", "/");
            }

            System.out.println("Login successful for: " + email);
            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            System.out.println("Registration attempt for email: " + request.getEmail() + " with role: " + request.getRole());
            
            Map<String, Object> response = new HashMap<>();
            
            // Check if email already exists
            if (studentRepository.findByEmail(request.getEmail()).isPresent() ||
                companyRepository.findByEmail(request.getEmail()).isPresent() ||
                ptoRepository.findByEmail(request.getEmail()).isPresent() ||
                adminRepository.findByEmail(request.getEmail()).isPresent()) {
                
                response.put("message", "Email already registered");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            if ("student".equalsIgnoreCase(request.getRole())) {
                Student student = new Student();
                student.setName(request.getName());
                student.setEmail(request.getEmail());
                student.setPassword(passwordEncoder.encode(request.getPassword()));
                student.setPhone(request.getPhone());
                student.setDepartment(request.getDepartment());
                student.setCourse(request.getCourse());
                student.setYear(request.getYear());
                student.setCgpa(request.getCgpa());
                student.setParentEmail(request.getParentEmail());
                student.setRole("student");
                student.setVerifiedByAdmin(false); // Still need admin verification
                
                studentRepository.save(student);
                
                response.put("message", "Student registered successfully. Please wait for admin verification.");
                response.put("status", "success");
                response.put("role", "student");
                
            } else if ("company".equalsIgnoreCase(request.getRole())) {
                Company company = new Company();
                company.setName(request.getName());
                company.setEmail(request.getEmail());
                company.setPassword(passwordEncoder.encode(request.getPassword()));
                company.setPhone(request.getPhone());
                company.setCompanyName(request.getCompanyName());
                company.setIndustry(request.getIndustry());
                company.setWebsite(request.getWebsite());
                company.setCompanySize(request.getCompanySize());
                company.setAddress(request.getAddress());
                company.setDescription(request.getDescription());
                company.setRole("company");
                company.setVerifiedByAdmin(false); // Still need admin verification
                
                companyRepository.save(company);
                
                response.put("message", "Company registered successfully. Please wait for admin verification.");
                response.put("status", "success");
                response.put("role", "company");
                
            } else {
                response.put("message", "Invalid role. Role must be 'student' or 'company'");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
            
            System.out.println("Registration successful for: " + request.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}