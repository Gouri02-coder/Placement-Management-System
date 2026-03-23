package com.placement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    private final JwtUtil jwtUtil;
    
    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter(jwtUtil);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .cors(cors -> {}) // Simplified CORS for testing
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Job Access Logic
                // Permit all authenticated users to View jobs (Students, PTO, Admin)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/jobs/**").authenticated()
                
                // Only Companies, PTO, and Admin can Create/Update/Delete jobs
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/jobs/**").hasAnyAuthority("COMPANY", "PTO", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/jobs/**").hasAnyAuthority("COMPANY", "PTO", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/jobs/**").hasAnyAuthority("ADMIN")

                // Role-based module access
                .requestMatchers("/api/student/**").hasAuthority("STUDENT")
                .requestMatchers("/api/company/**").hasAuthority("COMPANY")
                .requestMatchers("/api/pto/**").hasAuthority("PTO")
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}