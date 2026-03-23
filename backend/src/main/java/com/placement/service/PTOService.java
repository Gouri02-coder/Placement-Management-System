package com.placement.service;

import com.placement.model.PTO;
import java.util.List;
import java.util.Optional;

public interface PTOService {
    PTO createPTO(PTO pto);
    PTO updatePTO(Long id, PTO pto);
    void deletePTO(Long id);
    Optional<PTO> getPTOById(Long id);
    Optional<PTO> getPTOByEmail(String email);
    List<PTO> getAllPTOs();
    PTO authenticatePTO(String email, String password);
    boolean existsByEmail(String email);
    long getPTOCount();
    List<PTO> getPTOsByDepartment(String department);
    void verifyPTOEmail(Long id);
}