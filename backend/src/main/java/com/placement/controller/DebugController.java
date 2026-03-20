package com.placement.controller;

import com.placement.model.*;
import com.placement.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
public class DebugController {

    private final AdminRepository adminRepository;
    private final PTORepository ptoRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public DebugController(AdminRepository adminRepository,
                          PTORepository ptoRepository,
                          StudentRepository studentRepository,
                          CompanyRepository companyRepository,
                          PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.ptoRepository = ptoRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/check-pto")
    public ResponseEntity<?> checkPTO() {
        Map<String, Object> result = new HashMap<>();
        
        Optional<PTO> pto = ptoRepository.findByEmail("pto@college.ac.in");
        
        if (pto.isPresent()) {
            PTO p = pto.get();
            result.put("found", true);
            result.put("id", p.getId());
            result.put("email", p.getEmail());
            result.put("name", p.getName());
            result.put("role", p.getRole());
            result.put("passwordHash", p.getPassword());
            
            // Test password match for "Pto@123"
            boolean passwordMatches = passwordEncoder.matches("Pto@123", p.getPassword());
            result.put("passwordMatches", passwordMatches);
            
            // Generate a test hash for comparison
            String testHash = passwordEncoder.encode("Pto@123");
            result.put("testHash", testHash);
            result.put("hashStartsWith", p.getPassword().substring(0, 20) + "...");
        } else {
            result.put("found", false);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/check-admin")
    public ResponseEntity<?> checkAdmin() {
        Map<String, Object> result = new HashMap<>();
        
        Optional<Admin> admin = adminRepository.findByEmail("admin@placement.ac.in");
        
        if (admin.isPresent()) {
            Admin a = admin.get();
            result.put("found", true);
            result.put("id", a.getId());
            result.put("email", a.getEmail());
            result.put("name", a.getName());
            result.put("role", a.getRole());
            result.put("passwordHash", a.getPassword());
            
            boolean passwordMatches = passwordEncoder.matches("Admin@123", a.getPassword());
            result.put("passwordMatches", passwordMatches);
        } else {
            result.put("found", false);
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/test-login")
    public ResponseEntity<?> testLogin(@RequestBody LoginRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Check all repositories
            Optional<Admin> admin = adminRepository.findByEmail(request.getEmail());
            if (admin.isPresent()) {
                Admin a = admin.get();
                boolean matches = passwordEncoder.matches(request.getPassword(), a.getPassword());
                result.put("userType", "ADMIN");
                result.put("found", true);
                result.put("passwordMatches", matches);
                result.put("role", a.getRole());
                return ResponseEntity.ok(result);
            }
            
            Optional<PTO> pto = ptoRepository.findByEmail(request.getEmail());
            if (pto.isPresent()) {
                PTO p = pto.get();
                boolean matches = passwordEncoder.matches(request.getPassword(), p.getPassword());
                result.put("userType", "PTO");
                result.put("found", true);
                result.put("passwordMatches", matches);
   
                result.put("role", p.getRole());
                return ResponseEntity.ok(result);
            }
            
            Optional<Student> student = studentRepository.findByEmail(request.getEmail());
            if (student.isPresent()) {
                Student s = student.get();
                boolean matches = passwordEncoder.matches(request.getPassword(), s.getPassword());
                result.put("userType", "STUDENT");
                result.put("found", true);
                result.put("passwordMatches", matches);

                result.put("role", s.getRole());
                return ResponseEntity.ok(result);
            }
            
            Optional<Company> company = companyRepository.findByEmail(request.getEmail());
            if (company.isPresent()) {
                Company c = company.get();
                boolean matches = passwordEncoder.matches(request.getPassword(), c.getPassword());
                result.put("userType", "COMPANY");
                result.put("found", true);
                result.put("passwordMatches", matches);
 
                result.put("role", c.getRole());
                return ResponseEntity.ok(result);
            }
            
            result.put("found", false);
            result.put("message", "User not found");
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reset-pto")
    public ResponseEntity<?> resetPTO() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Optional<PTO> ptoOpt = ptoRepository.findByEmail("pto@college.ac.in");
            
            if (ptoOpt.isPresent()) {
                PTO pto = ptoOpt.get();
                String newPassword = "Pto@123";
                String encodedPassword = passwordEncoder.encode(newPassword);
                
                pto.setPassword(encodedPassword);
                pto.setRole("PTO");
                
                PTO saved = ptoRepository.save(pto);
                
                result.put("success", true);
                result.put("message", "PTO password reset successfully");
                result.put("email", saved.getEmail());
                result.put("newPassword", newPassword);
                result.put("encodedHash", encodedPassword);
                
                // Verify the new password works
                boolean verification = passwordEncoder.matches(newPassword, saved.getPassword());
                result.put("verificationPassed", verification);
                
            } else {
                // Create new PTO if doesn't exist
                PTO newPTO = new PTO();
                newPTO.setName("Placement Officer");
                newPTO.setEmail("pto@college.ac.in");
                newPTO.setPassword(passwordEncoder.encode("Pto@123"));
                newPTO.setPhone("9876543210");
                newPTO.setDepartment("Training & Placement");
                newPTO.setDesignation("Senior PTO");
                newPTO.setEmployeeId("PTO001");
                newPTO.setRole("PTO");
 
                
                PTO saved = ptoRepository.save(newPTO);
                
                result.put("success", true);
                result.put("message", "New PTO created");
                result.put("email", saved.getEmail());
            }
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reset-admin")
    public ResponseEntity<?> resetAdmin() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Optional<Admin> adminOpt = adminRepository.findByEmail("admin@placement.ac.in");
            
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole("ADMIN");
                
                adminRepository.save(admin);
                
                result.put("success", true);
                result.put("message", "Admin password reset successfully");
            } else {
                Admin newAdmin = new Admin();
                newAdmin.setName("System Administrator");
                newAdmin.setEmail("admin@placement.ac.in");
                newAdmin.setPassword(passwordEncoder.encode("Admin@123"));
                newAdmin.setRole("ADMIN");
//                newAdmin.setEmailVerified(true);
                
                adminRepository.save(newAdmin);
                
                result.put("success", true);
                result.put("message", "New Admin created");
            }
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }
}