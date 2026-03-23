package com.placement.service;

import com.placement.model.*;
import com.placement.repository.*;
import com.placement.config.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.Optional;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final AdminRepository adminRepository;
    private final PTORepository ptoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
    private Long tokenExpiration;

    public AuthService(StudentRepository studentRepository,
                       CompanyRepository companyRepository,
                       AdminRepository adminRepository,
                       PTORepository ptoRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {

        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.adminRepository = adminRepository;
        this.ptoRepository = ptoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // LOGIN
    public LoginResponse login(LoginRequest request) {
        try {
            System.out.println("AuthService.login called for email: " + request.getEmail());
            
            // Find user by email
            Object user = findUserByEmail(request.getEmail());

            if (user == null) {
                System.out.println("User not found with email: " + request.getEmail());
                throw new RuntimeException("Invalid email or password");
            }

            System.out.println("User found, verifying password...");
            
            // Verify password
            if (!verifyPassword(user, request.getPassword())) {
                System.out.println("Password verification failed");
                throw new RuntimeException("Invalid email or password");
            }

            System.out.println("Password verified successfully");
            
            // REMOVED email verification check completely
            
            // Check admin verification for students and companies (optional)
            if (user instanceof Student) {
                Student student = (Student) user;
                if (!student.isVerifiedByAdmin()) {
                    System.out.println("Student not verified by admin: " + student.getEmail());
                    throw new RuntimeException("Your account is pending admin approval");
                }
            } else if (user instanceof Company) {
                Company company = (Company) user;
                if (!company.isVerifiedByAdmin()) {
                    System.out.println("Company not verified by admin: " + company.getEmail());
                    throw new RuntimeException("Your account is pending admin approval");
                }
            }

            // Create login response
            return createLoginResponse(user);
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    // REGISTER
    public String register(RegisterRequest request) {

        if (request.getEmail() == null || request.getRole() == null) {
            throw new RuntimeException("Email and role are required");
        }

        if (findUserByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }

        validateEmailDomain(request.getEmail(), request.getRole());

        if ("student".equalsIgnoreCase(request.getRole())) {
            return registerStudent(request);
        } else if ("company".equalsIgnoreCase(request.getRole())) {
            return registerCompany(request);
        } else {
            throw new RuntimeException("Invalid role. Allowed roles: student, company");
        }
    }

    // FIND USER
    private Object findUserByEmail(String email) {
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isPresent()) return student.get();

        Optional<Company> company = companyRepository.findByEmail(email);
        if (company.isPresent()) return company.get();

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) return admin.get();

        Optional<PTO> pto = ptoRepository.findByEmail(email);
        if (pto.isPresent()) return pto.get();

        return null;
    }

    // VERIFY PASSWORD
    private boolean verifyPassword(Object user, String rawPassword) {
        if (user instanceof Student) {
            return passwordEncoder.matches(rawPassword, ((Student) user).getPassword());
        }
        if (user instanceof Company) {
            return passwordEncoder.matches(rawPassword, ((Company) user).getPassword());
        }
        if (user instanceof Admin) {
            return passwordEncoder.matches(rawPassword, ((Admin) user).getPassword());
        }
        if (user instanceof PTO) {
            return passwordEncoder.matches(rawPassword, ((PTO) user).getPassword());
        }
        return false;
    }

    // LOGIN RESPONSE
    private LoginResponse createLoginResponse(Object user) {
        LoginResponse response = new LoginResponse();
        LoginResponse.User userData = new LoginResponse.User();

        String roleName = "";
        String redirectUrl = "";

        if (user instanceof Student) {
            Student student = (Student) user;
            userData.setId(student.getId().toString());
            userData.setName(student.getName());
            userData.setEmail(student.getEmail());
            userData.setRole("STUDENT"); // Uppercase for consistency
            roleName = "STUDENT";
            redirectUrl = "/student/dashboard";
        }
        else if (user instanceof Company) {
            Company company = (Company) user;
            userData.setId(company.getId().toString());
            userData.setName(company.getName());
            userData.setEmail(company.getEmail());
            userData.setRole("COMPANY"); // Uppercase for consistency
            roleName = "COMPANY";
            redirectUrl = "/company/dashboard";
        }
        else if (user instanceof Admin) {
            Admin admin = (Admin) user;
            userData.setId(admin.getId().toString());
            userData.setName(admin.getName());
            userData.setEmail(admin.getEmail());
            userData.setRole("ADMIN"); // Uppercase for consistency
            roleName = "ADMIN";
            redirectUrl = "/admin/dashboard";
        }
        else if (user instanceof PTO) {
            PTO pto = (PTO) user;
            userData.setId(pto.getId().toString());
            userData.setName(pto.getName());
            userData.setEmail(pto.getEmail());
            userData.setRole("PTO"); // Uppercase for consistency
            roleName = "PTO";
            redirectUrl = "/placement/dashboard";
        }

        // Generate token with uppercase role
        String token = jwtUtil.generateToken(userData.getEmail(), roleName);
        
        response.setUser(userData);
        response.setToken(token);
        response.setRefreshToken(jwtUtil.generateRefreshToken(userData.getEmail()));
        response.setExpiresIn(tokenExpiration);
        response.setRedirectUrl(redirectUrl);

        System.out.println("Login response created for role: " + roleName);
        return response;
    }

    // STUDENT REGISTER
    private String registerStudent(RegisterRequest request) {
        if (request.getParentEmail() == null || request.getParentEmail().isBlank()) {
            throw new RuntimeException("Parent email is required for student registration");
        }

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
        // REMOVED emailVerified field
        student.setVerifiedByAdmin(false); // Still need admin verification

        studentRepository.save(student);
        return "Student registered successfully. Please wait for admin verification.";
    }

    // COMPANY REGISTER
    private String registerCompany(RegisterRequest request) {
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
        // REMOVED emailVerified field
        company.setVerifiedByAdmin(false); // Still need admin verification

        companyRepository.save(company);
        return "Company registered successfully. Please wait for admin verification.";
    }

    // EMAIL VALIDATION
    private void validateEmailDomain(String email, String role) {
        String emailLower = email.toLowerCase();

        if ("student".equalsIgnoreCase(role)) {
            if (!emailLower.endsWith(".edu.in") && !emailLower.endsWith(".edu")) {
                throw new RuntimeException("Students must register with an educational email address");
            }
        }
        else if ("company".equalsIgnoreCase(role)) {
            // Company emails can be anything
            return;
        }
    }

    // EMAIL EXISTS CHECK
    public boolean emailExists(String email) {
        return findUserByEmail(email) != null;
    }

    // GET USER ROLE
    public String getUserRole(String email) {
        Object user = findUserByEmail(email);
        
        if (user instanceof Student) return "STUDENT";
        if (user instanceof Company) return "COMPANY";
        if (user instanceof Admin) return "ADMIN";
        if (user instanceof PTO) return "PTO";
        
        return null;
    }
    
    // GET USER BY EMAIL
    public Object getUserByEmail(String email) {
        return findUserByEmail(email);
    }
}