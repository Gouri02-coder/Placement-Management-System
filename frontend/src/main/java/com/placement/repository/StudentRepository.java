package com.placement.repository;

import com.placement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    List<Student> findByDepartment(String department);
    List<Student> findByCourse(String course);
    List<Student> findByYear(Integer year);
    
    @Query("SELECT s FROM Student s WHERE s.cgpa >= :minCgpa")
    List<Student> findByCgpaGreaterThanEqual(Double minCgpa);
    
    boolean existsByEmail(String email);
}