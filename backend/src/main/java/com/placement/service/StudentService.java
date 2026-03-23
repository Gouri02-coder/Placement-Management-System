package com.placement.service;

import com.placement.model.Student;
import java.util.List;
import java.util.Optional;

public interface StudentService {
    
    // Student management methods
    List<Student> getAllStudents();
    Optional<Student> getStudentById(Long id);
    Student createStudent(Student student);
    Student updateStudent(Long id, Student updatedStudent);
    void deleteStudent(Long id);
    
    // Filter methods
    List<Student> getStudentsByDepartment(String department);
    List<Student> getStudentsByCourse(String course);
    List<Student> getStudentsByYear(Integer year);
    List<Student> getStudentsByCgpaGreaterThanEqual(Double cgpa);
    
    // Utility methods
    boolean existsByEmail(String email);
    Optional<Student> findByEmail(String email);
    
    // ADD THESE VERIFICATION METHODS
    List<Student> getUnverifiedStudents();
    List<Student> getVerifiedStudents();
    void verifyStudent(Long studentId);
    void rejectStudent(Long studentId, String reason);
    long countAllStudents();
    long countVerifiedStudents();
    long countUnverifiedStudents();
    
    // ADD THESE FOR DASHBOARD
    List<Object[]> getDepartmentWiseStats();
    List<Object[]> getCourseWiseStats();
    List<Object[]> getYearWiseStats();
}