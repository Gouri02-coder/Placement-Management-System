package com.placement.service.impl;

import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import com.placement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    @Override
    public Student createStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Student with email " + student.getEmail() + " already exists");
        }
        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(Long id, Student student) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        
        // Check if email is being changed and if it already exists
        if (!existingStudent.getEmail().equals(student.getEmail()) && 
            studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email " + student.getEmail() + " is already taken");
        }
        
        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setPhone(student.getPhone());
        existingStudent.setDepartment(student.getDepartment());
        existingStudent.setCourse(student.getCourse());
        existingStudent.setYear(student.getYear());
        existingStudent.setCgpa(student.getCgpa());
        
        return studentRepository.save(existingStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public List<Student> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    @Override
    public List<Student> getStudentsByCourse(String course) {
        return studentRepository.findByCourse(course);
    }

    @Override
    public List<Student> getStudentsByYear(Integer year) {
        return studentRepository.findByYear(year);
    }

    @Override
    public List<Student> getStudentsByCgpaGreaterThanEqual(Double cgpa) {
        return studentRepository.findByCgpaGreaterThanEqual(cgpa);
    }

    @Override
    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }
}