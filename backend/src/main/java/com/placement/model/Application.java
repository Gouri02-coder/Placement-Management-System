package com.placement.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private LocalDate appliedDate;

    // Status can be: APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED
    @Column(nullable = false)
    private String status;

    @Column(name = "attendance_status")
    private String attendanceStatus; // Used by PTO for drive attendance

    public Application() {
        this.appliedDate = LocalDate.now();
        this.status = "APPLIED";
    }

    public Application(Student student, Job job) {
        this();
        this.student = student;
        this.job = job;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public LocalDate getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDate appliedDate) { this.appliedDate = appliedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }
}