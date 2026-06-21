import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Job, JobApplication } from '../models/job.model';
import { cloneDemoApplications, DemoApplication } from '../components/applications/demo-applications.data';
import { AuthService } from '../../../core/services/auth.service';

export interface JobPortalJob extends Job {
  category: string;
  experience: 'fresher' | '0-2' | '2-5';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  featured: boolean;
  hot: boolean;
  companyTagline: string;
  summaryPoints: string[];
  applicationConfig: {
    requiresPortfolio?: boolean;
    requiresGithub?: boolean;
    requiresCoverLetter?: boolean;
    requiresAvailability?: boolean;
  };
}

const DEMO_JOBS: JobPortalJob[] = [
  {
    id: '101',
    title: 'Frontend Engineer',
    companyName: 'NovaStack Labs',
    description: 'Build modern student-facing web experiences with Angular, strong component design, and performance-minded architecture.',
    requirements: ['Strong command of Angular and TypeScript', 'Understanding of state management', 'Comfort with REST APIs and testing'],
    skillsRequired: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'REST APIs'],
    location: 'Bengaluru',
    type: 'full-time',
    salary: { min: 700000, max: 1100000, currency: 'INR' },
    applicationDeadline: new Date('2026-04-12'),
    positions: 6,
    status: 'active',
    postedDate: new Date('2026-03-22'),
    category: 'Product Engineering',
    experience: '0-2',
    workMode: 'Hybrid',
    featured: true,
    hot: true,
    companyTagline: 'Design-led product engineering for campus and enterprise workflows.',
    summaryPoints: ['Fast-track shortlist for strong UI portfolios', 'Live product ownership from day one', 'Mentorship under senior frontend leads'],
    applicationConfig: {
      requiresPortfolio: true,
      requiresGithub: true,
      requiresCoverLetter: true,
      requiresAvailability: true
    }
  },
  {
    id: '102',
    title: 'Data Analyst',
    companyName: 'InsightGrid Labs',
    description: 'Turn recruitment and placement data into decision-ready dashboards for hiring and student success teams.',
    requirements: ['Hands-on SQL and spreadsheet analysis', 'Power BI or Tableau exposure', 'Ability to communicate insights clearly'],
    skillsRequired: ['SQL', 'Power BI', 'Python', 'Excel', 'Analytics'],
    location: 'Chennai',
    type: 'full-time',
    salary: { min: 600000, max: 900000, currency: 'INR' },
    applicationDeadline: new Date('2026-04-08'),
    positions: 4,
    status: 'active',
    postedDate: new Date('2026-03-20'),
    category: 'Analytics',
    experience: 'fresher',
    workMode: 'Remote',
    featured: true,
    hot: false,
    companyTagline: 'Analytics systems that help recruiters act faster.',
    summaryPoints: ['Strong dashboard and reporting ownership', 'Works closely with business and hiring teams', 'Excellent fit for analytical freshers'],
    applicationConfig: {
      requiresCoverLetter: true,
      requiresAvailability: true
    }
  },
  {
    id: '103',
    title: 'Cloud Support Associate',
    companyName: 'NimbusWorks',
    description: 'Support customer-facing cloud systems, monitor platform health, and automate recurring operational tasks.',
    requirements: ['Linux fundamentals', 'Cloud basics and networking awareness', 'Strong troubleshooting mindset'],
    skillsRequired: ['AWS', 'Linux', 'Networking', 'Shell Scripting', 'Monitoring'],
    location: 'Pune',
    type: 'full-time',
    salary: { min: 550000, max: 820000, currency: 'INR' },
    applicationDeadline: new Date('2026-04-15'),
    positions: 8,
    status: 'active',
    postedDate: new Date('2026-03-18'),
    category: 'Cloud Operations',
    experience: 'fresher',
    workMode: 'Remote',
    featured: false,
    hot: true,
    companyTagline: 'Reliable cloud operations for fast-growing digital teams.',
    summaryPoints: ['Structured onboarding for cloud basics', 'Rotational support learning path', 'Good fit for Linux and networking learners'],
    applicationConfig: {
      requiresGithub: false,
      requiresCoverLetter: true,
      requiresAvailability: true
    }
  },
  {
    id: '104',
    title: 'UI Engineer Intern',
    companyName: 'PixelMint Studio',
    description: 'Design and build interactive UI systems for marketing, product, and design system experimentation.',
    requirements: ['Strong HTML/CSS fundamentals', 'Figma-to-code confidence', 'Curiosity about motion and UI craft'],
    skillsRequired: ['HTML', 'CSS', 'JavaScript', 'Figma', 'Design Systems'],
    location: 'Hyderabad',
    type: 'internship',
    salary: { min: 250000, max: 360000, currency: 'INR' },
    applicationDeadline: new Date('2026-04-05'),
    positions: 5,
    status: 'active',
    postedDate: new Date('2026-03-24'),
    category: 'Design Engineering',
    experience: 'fresher',
    workMode: 'Hybrid',
    featured: false,
    hot: false,
    companyTagline: 'Sharp interfaces with craft, motion, and product storytelling.',
    summaryPoints: ['Internship with real production UI work', 'Portfolio-heavy shortlist criteria', 'Strong mentorship from designers and frontend engineers'],
    applicationConfig: {
      requiresPortfolio: true,
      requiresCoverLetter: true
    }
  },
  {
    id: '105',
    title: 'Backend Developer',
    companyName: 'CoreAxis Systems',
    description: 'Develop scalable services, build APIs for recruitment tooling, and improve the performance of enterprise workflows.',
    requirements: ['Java or Node.js backend experience', 'Database fundamentals', 'Understanding of service-oriented systems'],
    skillsRequired: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Git'],
    location: 'Mumbai',
    type: 'full-time',
    salary: { min: 750000, max: 1200000, currency: 'INR' },
    applicationDeadline: new Date('2026-04-18'),
    positions: 3,
    status: 'active',
    postedDate: new Date('2026-03-23'),
    category: 'Platform Engineering',
    experience: '0-2',
    workMode: 'On-site',
    featured: true,
    hot: false,
    companyTagline: 'Platform engineering for high-throughput hiring ecosystems.',
    summaryPoints: ['API-heavy backend ownership', 'Structured engineering review process', 'Best fit for system-minded developers'],
    applicationConfig: {
      requiresGithub: true,
      requiresCoverLetter: true
    }
  },
  {
    id: '106',
    title: 'Operations Analyst',
    companyName: 'RouteBridge Ops',
    description: 'Coordinate reporting, workflow accuracy, and delivery operations across recruitment cycles and placement events.',
    requirements: ['Strong communication', 'Excel and reporting confidence', 'Operational thinking and process discipline'],
    skillsRequired: ['Excel', 'Reporting', 'Communication', 'Operations', 'Coordination'],
    location: 'Coimbatore',
    type: 'full-time',
    salary: { min: 500000, max: 760000, currency: 'INR' },
    applicationDeadline: new Date('2026-04-09'),
    positions: 7,
    status: 'active',
    postedDate: new Date('2026-03-21'),
    category: 'Business Operations',
    experience: 'fresher',
    workMode: 'Hybrid',
    featured: false,
    hot: true,
    companyTagline: 'Operational excellence for large-scale campus hiring execution.',
    summaryPoints: ['High-ownership process role', 'Good route into business operations', 'Clear KPI-driven work structure'],
    applicationConfig: {
      requiresCoverLetter: true,
      requiresAvailability: true
    }
  }
];

const INITIAL_APPLICATIONS: DemoApplication[] = [
  {
    id: 'APP-STU-301',
    jobId: '101',
    studentId: '123',
    appliedDate: new Date('2026-03-19T10:15:00'),
    status: 'under-review',
    coverLetter: 'I enjoy building polished Angular interfaces and collaborating closely with product and design teams.',
    resumeUrl: 'https://example.com/resume/riya-sharma.pdf',
    jobTitle: 'Frontend Engineer',
    companyName: 'NovaStack Labs',
    interviewDate: new Date('2026-03-29T11:00:00'),
    roleTrack: 'Product Engineering',
    locationPreference: 'Bengaluru or Hybrid',
    recruiterNote: 'Strong UI portfolio. Review for round-one technical screen.',
    matchScore: 92,
    skillsSnapshot: ['Angular', 'TypeScript', 'RxJS', 'SCSS'],
    milestones: [
      { label: 'Application Submitted', date: 'Mar 19, 2026', note: 'Resume and portfolio shared successfully.' },
      { label: 'Profile Reviewed', date: 'Mar 21, 2026', note: 'Recruiter shortlisted the profile for further review.' },
      { label: 'Team Screening', date: 'Mar 24, 2026', note: 'Awaiting engineering feedback.' }
    ]
  },
  {
    id: 'APP-STU-302',
    jobId: '102',
    studentId: '123',
    appliedDate: new Date('2026-03-15T14:40:00'),
    status: 'shortlisted',
    coverLetter: 'My projects in analytics and dashboard automation make me a strong fit for business-facing data roles.',
    resumeUrl: 'https://example.com/resume/riya-sharma-data.pdf',
    jobTitle: 'Data Analyst',
    companyName: 'InsightGrid Labs',
    interviewDate: new Date('2026-03-27T15:30:00'),
    roleTrack: 'Analytics & Reporting',
    locationPreference: 'Remote / Chennai',
    recruiterNote: 'Excellent CGPA and dashboard work. Ready for analytics discussion round.',
    matchScore: 88,
    skillsSnapshot: ['SQL', 'Power BI', 'Python', 'Excel'],
    milestones: [
      { label: 'Application Submitted', date: 'Mar 15, 2026', note: 'Application moved to recruiter queue.' },
      { label: 'Resume Screened', date: 'Mar 17, 2026', note: 'Skills aligned with reporting role.' },
      { label: 'Interview Shortlisted', date: 'Mar 22, 2026', note: 'Panel round scheduled for next week.' }
    ]
  },
  {
    id: 'APP-STU-303',
    jobId: '103',
    studentId: '123',
    appliedDate: new Date('2026-03-11T09:20:00'),
    status: 'applied',
    coverLetter: 'I am interested in cloud operations roles that combine scripting, monitoring, and system reliability.',
    resumeUrl: 'https://example.com/resume/riya-sharma-cloud.pdf',
    jobTitle: 'Cloud Support Associate',
    companyName: 'NimbusWorks',
    roleTrack: 'Cloud Operations',
    locationPreference: 'Pune or Remote',
    recruiterNote: 'Application received. Waiting for batch shortlist from hiring team.',
    matchScore: 81,
    skillsSnapshot: ['AWS Basics', 'Linux', 'Networking', 'Shell Scripting'],
    milestones: [
      { label: 'Application Submitted', date: 'Mar 11, 2026', note: 'Application submitted successfully.' },
      { label: 'ATS Matched', date: 'Mar 12, 2026', note: 'Profile tagged for cloud support hiring queue.' }
    ]
  }
];

function cloneJob(job: JobPortalJob): JobPortalJob {
  return {
    ...job,
    requirements: [...job.requirements],
    skillsRequired: [...job.skillsRequired],
    summaryPoints: [...job.summaryPoints],
    applicationConfig: { ...job.applicationConfig },
    salary: { ...job.salary },
    applicationDeadline: new Date(job.applicationDeadline),
    postedDate: new Date(job.postedDate)
  };
}

function cloneApplication(application: DemoApplication): DemoApplication {
  return {
    ...application,
    appliedDate: new Date(application.appliedDate),
    interviewDate: application.interviewDate ? new Date(application.interviewDate) : undefined,
    skillsSnapshot: [...application.skillsSnapshot],
    milestones: application.milestones.map(milestone => ({ ...milestone }))
  };
}

@Injectable({
  providedIn: 'root'
})
export class JobPortalStoreService {
  private readonly jobsSubject = new BehaviorSubject<JobPortalJob[]>(DEMO_JOBS.map(cloneJob));
  private readonly applicationsSubject = new BehaviorSubject<DemoApplication[]>(INITIAL_APPLICATIONS.map(cloneApplication));
  private readonly savedJobIdsSubject = new BehaviorSubject<string[]>([]);

  readonly jobs$ = this.jobsSubject.asObservable();
  readonly applications$ = this.applicationsSubject.asObservable();
  readonly savedJobIds$ = this.savedJobIdsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.syncSavedJobIds();
    this.ensureDemoApplicationsForCurrentStudent();
  }

  private get currentStudentId(): string {
    return this.authService.currentUserValue?.id || '123';
  }

  private get savedJobsStorageKey(): string {
    return `student_saved_jobs_${this.currentStudentId}`;
  }

  private syncSavedJobIds(): void {
    const savedIds = localStorage.getItem(this.savedJobsStorageKey);
    this.savedJobIdsSubject.next(savedIds ? JSON.parse(savedIds) : ['104', '105']);
  }

  getJobsSnapshot(): JobPortalJob[] {
    return this.jobsSubject.value.map(cloneJob);
  }

  getApplicationsSnapshot(): DemoApplication[] {
    this.ensureDemoApplicationsForCurrentStudent();
    return this.applicationsSubject.value
      .filter(application => application.studentId === this.currentStudentId)
      .map(cloneApplication);
  }

  getSavedJobIdsSnapshot(): string[] {
    this.syncSavedJobIds();
    return [...this.savedJobIdsSubject.value];
  }

  getJobById(jobId: string | null): JobPortalJob | null {
    if (!jobId) {
      return null;
    }

    const match = this.jobsSubject.value.find(job => job.id === jobId);
    return match ? cloneJob(match) : null;
  }

  getApplicationById(applicationId: string | null): DemoApplication | null {
    if (!applicationId) {
      return null;
    }

    this.ensureDemoApplicationsForCurrentStudent();
    const match = this.applicationsSubject.value.find(
      application => application.id === applicationId && application.studentId === this.currentStudentId
    );
    return match ? cloneApplication(match) : null;
  }

  isJobApplied(jobId: string): boolean {
    this.ensureDemoApplicationsForCurrentStudent();
    return this.applicationsSubject.value.some(
      application => application.jobId === jobId && application.studentId === this.currentStudentId
    );
  }

  isJobSaved(jobId: string): boolean {
    this.syncSavedJobIds();
    return this.savedJobIdsSubject.value.includes(jobId);
  }

  toggleSavedJob(jobId: string): void {
    this.syncSavedJobIds();
    const savedIds = this.savedJobIdsSubject.value;
    const nextValue =
      savedIds.includes(jobId)
        ? savedIds.filter(id => id !== jobId)
        : [...savedIds, jobId];
    this.savedJobIdsSubject.next(nextValue);
    localStorage.setItem(this.savedJobsStorageKey, JSON.stringify(nextValue));
  }

  createApplication(jobId: string, formValue: {
    resumeUrl: string;
    coverLetter: string;
    availability?: string;
    expectedSalary?: string;
    portfolioUrl?: string;
    githubUrl?: string;
  }): DemoApplication | null {
    const job = this.jobsSubject.value.find(item => item.id === jobId);
    if (!job || this.isJobApplied(jobId)) {
      return null;
    }

    const newApplication: DemoApplication = {
      id: `APP-STU-${this.applicationsSubject.value.length + 301}`,
      jobId: job.id,
      studentId: this.currentStudentId,
      appliedDate: new Date(),
      status: 'applied',
      coverLetter: formValue.coverLetter,
      resumeUrl: formValue.resumeUrl,
      jobTitle: job.title,
      companyName: job.companyName,
      roleTrack: job.category,
      locationPreference: formValue.availability || job.location,
      recruiterNote: 'Application received. Recruiter review will begin shortly.',
      matchScore: this.calculateMatchScore(job),
      skillsSnapshot: [...job.skillsRequired.slice(0, 4)],
      milestones: [
        { label: 'Application Submitted', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), note: 'Application submitted through the student job portal.' },
        { label: 'Recruiter Queue', date: 'Next update pending', note: 'Your profile is now in the recruiter screening queue.' }
      ]
    };

    this.applicationsSubject.next([newApplication, ...this.applicationsSubject.value.map(cloneApplication)]);
    return cloneApplication(newApplication);
  }

  updateApplication(applicationId: string, updates: Partial<DemoApplication>): void {
    this.applicationsSubject.next(
      this.applicationsSubject.value.map(application =>
        application.id === applicationId && application.studentId === this.currentStudentId
          ? cloneApplication({ ...application, ...updates })
          : cloneApplication(application)
      )
    );
  }

  private calculateMatchScore(job: JobPortalJob): number {
    const base = 78 + Math.min(job.skillsRequired.length * 2, 14);
    return Math.min(base, 95);
  }

  private ensureDemoApplicationsForCurrentStudent(): void {
    const hasCurrentStudentApplications = this.applicationsSubject.value.some(
      application => application.studentId === this.currentStudentId
    );

    if (hasCurrentStudentApplications) {
      return;
    }

    const seededApplications = cloneDemoApplications().map(application =>
      cloneApplication({
        ...application,
        studentId: this.currentStudentId
      })
    );

    this.applicationsSubject.next([
      ...seededApplications,
      ...this.applicationsSubject.value.map(cloneApplication)
    ]);
  }
}
