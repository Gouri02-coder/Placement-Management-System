package com.placement.controller;

import com.placement.model.Student;
import com.placement.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pto")
@CrossOrigin(origins = "http://localhost:4200")
public class PTOController {

    private final StudentService studentService;

    public PTOController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students")
    public ResponseEntity<Map<String, Object>> getStudents() {
        return ResponseEntity.ok(buildStudentResponse(studentService.getAllStudents()));
    }

    @GetMapping("/students/pending")
    public ResponseEntity<Map<String, Object>> getPendingStudents() {
        List<Student> pendingStudents = studentService.getAllStudents().stream()
                .filter(student -> !student.isVerifiedByAdmin() && !student.isRejectedByAdmin())
                .toList();
        return ResponseEntity.ok(buildStudentResponse(pendingStudents));
    }

    @GetMapping("/students/verified")
    public ResponseEntity<Map<String, Object>> getVerifiedStudents() {
        return ResponseEntity.ok(buildStudentResponse(studentService.getVerifiedStudents()));
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getStudentById(@PathVariable Long studentId) {
        return studentService.getStudentById(studentId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/students/{studentId}/approve")
    public ResponseEntity<Map<String, Object>> approveStudent(@PathVariable Long studentId) {
        studentService.verifyStudent(studentId);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Student approved successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/students/{studentId}/reject")
    public ResponseEntity<Map<String, Object>> rejectStudent(
            @PathVariable Long studentId,
            @RequestBody(required = false) Map<String, String> request) {
        String reason = request != null ? request.getOrDefault("reason", "Not selected by the Placement Office") : "Not selected by the Placement Office";
        studentService.rejectStudent(studentId, reason);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Student rejected successfully");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> buildStudentResponse(List<Student> students) {
        long approved = students.stream().filter(Student::isVerifiedByAdmin).count();
        long rejected = students.stream().filter(Student::isRejectedByAdmin).count();
        long pending = students.stream().filter(student -> !student.isVerifiedByAdmin() && !student.isRejectedByAdmin()).count();

        List<Map<String, Object>> studentPayload = students.stream().map(student -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", student.getId());
            item.put("name", student.getName());
            item.put("email", student.getEmail());
            item.put("phone", student.getPhone());
            item.put("department", student.getDepartment());
            item.put("course", student.getCourse());
            item.put("year", student.getYear());
            item.put("cgpa", student.getCgpa());
            item.put("createdDate", student.getCreatedDate());
            item.put("verified", student.isVerifiedByAdmin());
            item.put("approved", student.isVerifiedByAdmin());
            item.put("rejected", student.isRejectedByAdmin());
            item.put("verifiedByAdmin", student.isVerifiedByAdmin());
            item.put("rejectedByAdmin", student.isRejectedByAdmin());
            item.put("rejectionReason", student.getRejectionReason());
            return item;
        }).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("students", studentPayload);
        response.put("total", students.size());
        response.put("approved", approved);
        response.put("pending", pending);
        response.put("rejected", rejected);
        return response;
    }
}
