package com.placement.repository;

import com.placement.model.GPSLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GPSLogRepository extends JpaRepository<GPSLog, Long> {
    List<GPSLog> findByPtoEmail(String email);
}