package com.placement.config;

import com.placement.model.Admin;
import com.placement.model.PTO;
import com.placement.repository.AdminRepository;
import com.placement.repository.PTORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PTORepository ptoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create/Update 2 Admins
        createOrUpdateAdmin("admin1@placement.ac.in", "Admin One", "Admin@123");
        createOrUpdateAdmin("admin2@placement.ac.in", "Admin Two", "Admin@456");

        // Create/Update 2 PTOs
        createOrUpdatePTO(
                "pto1@college.ac.in",
                "PTO One",
                "Pto@123",
                "9876543210",
                "Training & Placement",
                "Senior PTO",
                "PTO001"
        );
        createOrUpdatePTO(
                "pto2@college.ac.in",
                "PTO Two",
                "Pto@456",
                "9876543211",
                "Training & Placement",
                "Junior PTO",
                "PTO002"
        );

        System.out.println("✅ Data initialization completed.");
    }

    private void createOrUpdateAdmin(String email, String name, String rawPassword) {
        Optional<Admin> existing = adminRepository.findByEmail(email);
        if (existing.isEmpty()) {
            Admin admin = new Admin();
            admin.setName(name);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(rawPassword));
            admin.setRole("admin");
            adminRepository.save(admin);
            System.out.println("✅ Created admin: " + email);
        } else {
            System.out.println("ℹ️ Admin already exists: " + email);
        }
    }

    private void createOrUpdatePTO(String email, String name, String rawPassword,
                                   String phone, String department,
                                   String designation, String employeeId) {
        Optional<PTO> existing = ptoRepository.findByEmail(email);
        if (existing.isEmpty()) {
            PTO pto = new PTO();
            pto.setName(name);
            pto.setEmail(email);
            pto.setPassword(passwordEncoder.encode(rawPassword));
            pto.setPhone(phone);
            pto.setDepartment(department);
            pto.setDesignation(designation);
            pto.setEmployeeId(employeeId);
            pto.setRole("pto");
            pto.setCreatedAt(LocalDateTime.now());
            pto.setUpdatedAt(LocalDateTime.now());
            ptoRepository.save(pto);
            System.out.println("✅ Created PTO: " + email);
        } else {
            System.out.println("ℹ️ PTO already exists: " + email);
        }
    }
}