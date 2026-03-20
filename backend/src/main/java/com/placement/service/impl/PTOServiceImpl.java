package com.placement.service.impl;

import com.placement.model.PTO;
import com.placement.repository.PTORepository;
import com.placement.service.PTOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PTOServiceImpl implements PTOService {
    
    @Autowired
    private PTORepository ptoRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public PTO createPTO(PTO pto) {
        // Encode password before saving
        pto.setPassword(passwordEncoder.encode(pto.getPassword()));
        pto.setCreatedAt(LocalDateTime.now());
        pto.setUpdatedAt(LocalDateTime.now());
        return ptoRepository.save(pto);
    }
    
    @Override
    public PTO updatePTO(Long id, PTO ptoDetails) {
        PTO existingPTO = ptoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("PTO not found with id: " + id));
        
        // Update fields
        existingPTO.setName(ptoDetails.getName());
        existingPTO.setPhone(ptoDetails.getPhone());
        existingPTO.setDepartment(ptoDetails.getDepartment());
        existingPTO.setDesignation(ptoDetails.getDesignation());
        existingPTO.setEmployeeId(ptoDetails.getEmployeeId());
        existingPTO.setUpdatedAt(LocalDateTime.now());
        
        // Update password only if provided
        if (ptoDetails.getPassword() != null && !ptoDetails.getPassword().isEmpty()) {
            existingPTO.setPassword(passwordEncoder.encode(ptoDetails.getPassword()));
        }
        
        return ptoRepository.save(existingPTO);
    }
    
    @Override
    public void deletePTO(Long id) {
        if (!ptoRepository.existsById(id)) {
            throw new RuntimeException("PTO not found with id: " + id);
        }
        ptoRepository.deleteById(id);
    }
    
    @Override
    public Optional<PTO> getPTOById(Long id) {
        return ptoRepository.findById(id);
    }
    
    @Override
    public Optional<PTO> getPTOByEmail(String email) {
        return ptoRepository.findByEmail(email);
    }
    
    @Override
    public List<PTO> getAllPTOs() {
        return ptoRepository.findAll();
    }
    
    @Override
    public PTO authenticatePTO(String email, String password) {
        Optional<PTO> ptoOpt = ptoRepository.findByEmail(email);
        if (ptoOpt.isPresent()) {
            PTO pto = ptoOpt.get();
            if (passwordEncoder.matches(password, pto.getPassword())) {
                return pto;
            }
        }
        return null;
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return ptoRepository.existsByEmail(email);
    }
    
    @Override
    public long getPTOCount() {
        return ptoRepository.count();
    }
    
    @Override
    public List<PTO> getPTOsByDepartment(String department) {
        // You'll need to add this method to PTORepository
        return ptoRepository.findByDepartment(department);
    }
    
    @Override
    public void verifyPTOEmail(Long id) {
        PTO pto = ptoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("PTO not found with id: " + id));

        pto.setUpdatedAt(LocalDateTime.now());
        ptoRepository.save(pto);
    }
}