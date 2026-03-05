package com.placement.service;

import com.placement.model.Student;
import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<Student> getAllStudents();
    Optional<Student> getStudentById(Long id);
    Student createStudent(Student student);
    Student updateStudent(Long id, Student student);
    void deleteStudent(Long id);
    List<Student> getStudentsByDepartment(String department);
    List<Student> getStudentsByCourse(String course);
    List<Student> getStudentsByYear(Integer year);
    List<Student> getStudentsByCgpaGreaterThanEqual(Double cgpa);
    boolean existsByEmail(String email);
}