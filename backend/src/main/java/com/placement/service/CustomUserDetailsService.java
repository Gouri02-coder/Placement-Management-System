package com.placement.service;

import com.placement.model.*;
import com.placement.repository.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final AdminRepository adminRepository;
    private final PTORepository ptoRepository;
    
    public CustomUserDetailsService(StudentRepository studentRepository,
                                   CompanyRepository companyRepository,
                                   AdminRepository adminRepository,
                                   PTORepository ptoRepository) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.adminRepository = adminRepository;
        this.ptoRepository = ptoRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        
        // Check in all repositories
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isPresent()) {
            Student s = student.get();
            return User.builder()
                    .username(s.getEmail())
                    .password(s.getPassword())
                    .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority(s.getRole().toUpperCase())
                    ))
                    .build();
        }
        
        Optional<Company> company = companyRepository.findByEmail(email);
        if (company.isPresent()) {
            Company c = company.get();
            return User.builder()
                    .username(c.getEmail())
                    .password(c.getPassword())
                    .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority(c.getRole().toUpperCase())
                    ))
                    .build();
        }
        
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            Admin a = admin.get();
            return User.builder()
                    .username(a.getEmail())
                    .password(a.getPassword())
                    .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority(a.getRole().toUpperCase())
                    ))
                    .build();
        }
        
        Optional<PTO> pto = ptoRepository.findByEmail(email);
        if (pto.isPresent()) {
            PTO p = pto.get();
            return User.builder()
                    .username(p.getEmail())
                    .password(p.getPassword())
                    .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority(p.getRole().toUpperCase())
                    ))
                    .build();
        }
        
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}