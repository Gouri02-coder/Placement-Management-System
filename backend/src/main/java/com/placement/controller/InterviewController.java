package com.placement.controller;

import com.placement.dto.AttendanceDTO;
import com.placement.dto.InterviewScheduleDTO;
import com.placement.model.Job;
import com.placement.model.Placement;
import com.placement.model.Student;
import com.placement.repository.JobRepository;
import com.placement.repository.PlacementRepository;
import com.placement.repository.StudentRepository;
import com.placement.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*")
public class InterviewController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PlacementRepository placementRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/students")
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleInterview(@RequestBody InterviewScheduleDTO dto) {

        Optional<Student> studentOptional = studentRepository.findById(dto.getStudentId());
        if (studentOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        Optional<Job> jobOptional = jobRepository.findById(dto.getJobId());
        if (jobOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Job not found");
        }

        Placement placement = new Placement();
        placement.setStudent(studentOptional.get());
        placement.setJob(jobOptional.get());
        placement.setInterviewDate(dto.getInterviewDate());
        placement.setInterviewLocation(dto.getInterviewLocation());
        placement.setStatus("SCHEDULED");

        placementRepository.save(placement);

        return ResponseEntity.ok("Interview scheduled and stored successfully");
    }

    @PostMapping("/mark-attendance")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceDTO dto) {

        Optional<Placement> placementOptional = placementRepository.findById(dto.getPlacementId());
        if (placementOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Placement record not found");
        }

        Placement placement = placementOptional.get();
        placement.setStatus(dto.getStatus());

        placementRepository.save(placement);

        if ("ABSENT".equalsIgnoreCase(dto.getStatus())) {
            String studentEmail = placement.getStudent().getEmail();
            String studentName = placement.getStudent().getName();

            String companyName;
            if (placement.getJob() != null && placement.getJob().getCompany() != null) {
                companyName = placement.getJob().getCompany().getCompanyName();
            } else {
                companyName = "Company Not Available";
            }

            String interviewDate;
            if (placement.getInterviewDate() != null) {
                interviewDate = placement.getInterviewDate().toString();
            } else {
                interviewDate = "Not Available";
            }

            emailService.sendAbsentInterviewEmail(studentEmail, studentName, companyName, interviewDate);

            return ResponseEntity.ok("Attendance marked ABSENT and email sent successfully");
        }

        return ResponseEntity.ok("Attendance marked successfully");
    }
}