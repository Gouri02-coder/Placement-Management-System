package com.placement.service;

import com.placement.model.Job;
import java.util.List;
import java.util.Optional;

public interface JobService {
    List<Job> getAllJobs();
    Optional<Job> getJobById(Long id);
    Job createJob(Job job);
    Job updateJob(Long id, Job job);
    void deleteJob(Long id);
    List<Job> getJobsByCompany(Long companyId);
    List<Job> getActiveJobs();
    List<Job> getJobsByType(String jobType);
    List<Job> getJobsByLocation(String location);
    List<Job> getJobsBySalaryRange(Double minSalary, Double maxSalary);
    List<Job> searchJobsByCompanyName(String companyName);
}