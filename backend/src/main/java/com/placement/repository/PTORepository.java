package com.placement.repository;

import com.placement.model.PTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PTORepository extends JpaRepository<PTO, Long> {
    Optional<PTO> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<PTO> findByEmployeeId(String employeeId);
	List<PTO> findByDepartment(String department);
}