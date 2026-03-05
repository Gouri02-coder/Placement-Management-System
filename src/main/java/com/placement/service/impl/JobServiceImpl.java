package com.placement.service.impl;

import com.placement.model.Job;
import com.placement.repository.JobRepository;
import com.placement.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    @Override
    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    @Override
    public Job updateJob(Long id, Job job) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        
        existingJob.setTitle(job.getTitle());
        existingJob.setDescription(job.getDescription());
        existingJob.setRequirements(job.getRequirements());
        existingJob.setSalary(job.getSalary());
        existingJob.setLocation(job.getLocation());
        existingJob.setJobType(job.getJobType());
        existingJob.setOpenings(job.getOpenings());
        existingJob.setApplyDeadline(job.getApplyDeadline());
        
        return jobRepository.save(existingJob);
    }

    @Override
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    @Override
    public List<Job> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    @Override
    public List<Job> getActiveJobs() {
        return jobRepository.findActiveJobs(LocalDate.now());
    }

    @Override
    public List<Job> getJobsByType(String jobType) {
        return jobRepository.findByJobType(jobType);
    }

    @Override
    public List<Job> getJobsByLocation(String location) {
        return jobRepository.findByLocation(location);
    }

    @Override
    public List<Job> getJobsBySalaryRange(Double minSalary, Double maxSalary) {
        return jobRepository.findBySalaryRange(minSalary, maxSalary);
    }

    @Override
    public List<Job> searchJobsByCompanyName(String companyName) {
        return jobRepository.findByCompanyNameContainingIgnoreCase(companyName);
    }
}