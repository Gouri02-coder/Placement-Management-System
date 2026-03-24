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
    boolean existsByEmail(String email);
    List<Student> findByDepartment(String department);
    List<Student> findByCourse(String course);
    List<Student> findByYear(Integer year);
    List<Student> findByCgpaGreaterThanEqual(Double cgpa);
    
    // ADD THESE VERIFICATION METHODS
    List<Student> findByVerifiedByAdminFalse();
    List<Student> findByVerifiedByAdminTrue();
    long countByVerifiedByAdminTrue();
    long countByVerifiedByAdminFalse();
    
    // ADD THESE FOR DASHBOARD STATS
    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department")
    List<Object[]> countStudentsByDepartment();
    
    @Query("SELECT s.course, COUNT(s) FROM Student s GROUP BY s.course")
    List<Object[]> countStudentsByCourse();
    
    @Query("SELECT s.year, COUNT(s) FROM Student s GROUP BY s.year")
    List<Object[]> countStudentsByYear();
}