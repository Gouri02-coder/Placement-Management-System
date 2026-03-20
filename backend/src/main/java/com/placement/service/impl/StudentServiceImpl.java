package com.placement.service.impl;

import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import com.placement.service.StudentService;
import com.placement.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public StudentServiceImpl(StudentRepository studentRepository, 
                              PasswordEncoder passwordEncoder, 
                              EmailService emailService) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

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
            throw new RuntimeException("Email already exists: " + student.getEmail());
        }
        
        // Encode password
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        
        // Set default values
        student.setRole("student");
        student.setVerifiedByAdmin(false);
        
        Student savedStudent = studentRepository.save(student);

        // Send confirmation email to student
        emailService.sendEmail(student.getEmail(), 
            "Registration Received", 
            "Hello " + student.getName() + ", your registration is pending approval from the Placement Office.");
        
        // Also send email to parent if parentEmail exists
        if (student.getParentEmail() != null && !student.getParentEmail().isEmpty()) {
            emailService.sendEmail(student.getParentEmail(), 
                "Student Registration Notification", 
                "Your ward " + student.getName() + " has registered for the Placement Management System. They will need admin verification before participating in placements.");
        }
        
        return savedStudent;
    }

    @Override
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        if (updatedStudent.getName() != null) existingStudent.setName(updatedStudent.getName());
        if (updatedStudent.getPhone() != null) existingStudent.setPhone(updatedStudent.getPhone());
        if (updatedStudent.getDepartment() != null) existingStudent.setDepartment(updatedStudent.getDepartment());
        if (updatedStudent.getCourse() != null) existingStudent.setCourse(updatedStudent.getCourse());
        if (updatedStudent.getYear() != null) existingStudent.setYear(updatedStudent.getYear());
        if (updatedStudent.getCgpa() != null) existingStudent.setCgpa(updatedStudent.getCgpa());
        if (updatedStudent.getParentEmail() != null) existingStudent.setParentEmail(updatedStudent.getParentEmail());

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

    @Override
    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }
    
    @Override
    public List<Student> getUnverifiedStudents() {
        return studentRepository.findByVerifiedByAdminFalse();
    }
    
    @Override
    public List<Student> getVerifiedStudents() {
        return studentRepository.findByVerifiedByAdminTrue();
    }
    
    @Override
    @Transactional
    public void verifyStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        student.setVerifiedByAdmin(true);
        studentRepository.save(student);

        // Send verification success email
        emailService.sendEmail(student.getEmail(), 
            "Account Verified", 
            "Congratulations " + student.getName() + "! Your profile has been verified. You can now apply for jobs.");
        
        // Also notify parent if parentEmail exists
        if (student.getParentEmail() != null && !student.getParentEmail().isEmpty()) {
            emailService.sendEmail(student.getParentEmail(), 
                "Student Account Verified", 
                "Your ward " + student.getName() + "'s account has been verified. They can now participate in placement activities.");
        }
    }
    
    @Override
    @Transactional
    public void rejectStudent(Long studentId, String reason) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        // Send rejection email to student
        emailService.sendEmail(student.getEmail(), 
            "Application Rejected", 
            "Your profile was not approved. Reason: " + reason);
        
        // Also notify parent if parentEmail exists
        if (student.getParentEmail() != null && !student.getParentEmail().isEmpty()) {
            emailService.sendEmail(student.getParentEmail(), 
                "Student Application Status", 
                "Your ward " + student.getName() + "'s application was not approved. Reason: " + reason);
        }
            
        studentRepository.delete(student);
    }
    
    @Override
    public long countAllStudents() { return studentRepository.count(); }
    
    @Override
    public long countVerifiedStudents() { return studentRepository.countByVerifiedByAdminTrue(); }
    
    @Override
    public long countUnverifiedStudents() { return studentRepository.countByVerifiedByAdminFalse(); }
    
    @Override
    public List<Object[]> getDepartmentWiseStats() { return studentRepository.countStudentsByDepartment(); }
    
    @Override
    public List<Object[]> getCourseWiseStats() { return studentRepository.countStudentsByCourse(); }
    
    @Override
    public List<Object[]> getYearWiseStats() { return studentRepository.countStudentsByYear(); }
}