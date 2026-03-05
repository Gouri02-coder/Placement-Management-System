package com.placement.controller;

import com.placement.model.Job;
import com.placement.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:4200")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobService.getJobById(id);
        return job.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) {
        Job createdJob = jobService.createJob(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @Valid @RequestBody Job job) {
        try {
            Job updatedJob = jobService.updateJob(id, job);
            return ResponseEntity.ok(updatedJob);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Job>> getJobsByCompany(@PathVariable Long companyId) {
        List<Job> jobs = jobService.getJobsByCompany(companyId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Job>> getActiveJobs() {
        List<Job> jobs = jobService.getActiveJobs();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/type/{jobType}")
    public ResponseEntity<List<Job>> getJobsByType(@PathVariable String jobType) {
        List<Job> jobs = jobService.getJobsByType(jobType);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<Job>> getJobsByLocation(@PathVariable String location) {
        List<Job> jobs = jobService.getJobsByLocation(location);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/salary-range")
    public ResponseEntity<List<Job>> getJobsBySalaryRange(
            @RequestParam Double minSalary, 
            @RequestParam Double maxSalary) {
        List<Job> jobs = jobService.getJobsBySalaryRange(minSalary, maxSalary);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobsByCompany(@RequestParam String companyName) {
        List<Job> jobs = jobService.searchJobsByCompanyName(companyName);
        return ResponseEntity.ok(jobs);
    }
}