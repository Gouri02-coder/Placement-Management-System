// student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { ApplicationService } from '../../services/application.service';
import { InterviewService } from '../../services/interview.service';
import { JobService } from '../../services/job.service';
import { Student } from '../../models/student.model';
import { JobApplication } from '../../models/job.model';
import { Interview } from '../../models/interview.model';
import { Job } from '../../models/job.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  student: Student | null = null;
  applications: JobApplication[] = [];
  interviews: Interview[] = [];
  recommendedJobs: Job[] = [];
  stats = {
    totalApplications: 0,
    pendingApplications: 0,
    interviewsScheduled: 0,
    profileCompletion: 0
  };

  constructor(
    private studentService: StudentService,
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const studentId = '123'; // Get from auth service
    
    // Load student profile
    this.studentService.getStudentProfile(studentId).subscribe({
      next: (student) => {
        this.student = student;
        this.calculateProfileCompletion();
      },
      error: (error) => {
        console.error('Error loading student profile:', error);
      }
    });

    // Load applications
    this.applicationService.getStudentApplications(studentId).subscribe({
      next: (applications) => {
        this.applications = applications.filter(
          app => app.status !== 'draft'
        ) as JobApplication[];
        this.calculateApplicationStats();
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      }
    });

    // Load interviews
    this.interviewService.getStudentInterviews(studentId).subscribe({
      next: (interviews) => {
        this.interviews = interviews;
        this.stats.interviewsScheduled = interviews.length;
      },
      error: (error) => {
        console.error('Error loading interviews:', error);
      }
    });

    // Load recommended jobs
      // Load recommended jobs
    this.jobService.getRecommendedJobs(studentId).subscribe({
      next: (jobs: Job[]) => {
        this.recommendedJobs = jobs.slice(0, 4);
      },
      error: (error: any) => {
        console.error('Error loading recommended jobs:', error);
      }
    });
  }

  calculateProfileCompletion(): void {
    if (!this.student) return;
    let completion = 0;
    
    // Personal info (25%)
    const personalInfo = this.student.personalInfo;
    if (personalInfo.firstName && personalInfo.lastName && 
        personalInfo.email && personalInfo.phone) {
      completion += 25;
    }
    
    // Academic info (25%)
    const academicInfo = this.student.academicInfo;
    if (academicInfo.college && academicInfo.degree && 
        academicInfo.branch && academicInfo.cgpa) {
      completion += 25;
    }
    
    // Skills (25%)
    if (this.student.skills && this.student.skills.length >= 3) {
      completion += 25;
    }
    
    // Resume (25%)
    if (this.student.resumeUrl) {
      completion += 25;
    }
    
    this.stats.profileCompletion = completion;
  }

  calculateApplicationStats(): void {
    this.stats.totalApplications = this.applications.length;
    this.stats.pendingApplications = this.applications.filter(
      app => app.status === 'applied' || app.status === 'under-review'
    ).length;
  }

  calculateDaysAgo(date: Date): string {
    const now = new Date();
    const appliedDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - appliedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    return `${Math.floor(diffDays / 30)} months`;
  }
}