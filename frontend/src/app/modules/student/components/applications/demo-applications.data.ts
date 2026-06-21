import { JobApplication } from '../../models/job.model';

export interface ApplicationMilestone {
  label: string;
  date: string;
  note: string;
}

export interface DemoApplication extends JobApplication {
  roleTrack: string;
  locationPreference: string;
  recruiterNote: string;
  matchScore: number;
  skillsSnapshot: string[];
  milestones: ApplicationMilestone[];
}

export const DEMO_APPLICATIONS: DemoApplication[] = [
  {
    id: 'APP-STU-301',
    jobId: 'JOB-ANG-21',
    studentId: '123',
    appliedDate: new Date('2026-03-19T10:15:00'),
    status: 'under-review',
    coverLetter: 'I enjoy building polished Angular interfaces and collaborating closely with product and design teams.',
    resumeUrl: 'https://example.com/resume/riya-sharma.pdf',
    jobTitle: 'Frontend Developer',
    companyName: 'PlacementPro Technologies',
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
    jobId: 'JOB-DATA-17',
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
    jobId: 'JOB-CLD-08',
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

export function cloneDemoApplications(): DemoApplication[] {
  return DEMO_APPLICATIONS.map(application => ({
    ...application,
    skillsSnapshot: [...application.skillsSnapshot],
    milestones: application.milestones.map(milestone => ({ ...milestone }))
  }));
}

export function findDemoApplicationById(applicationId: string | null): DemoApplication | null {
  if (!applicationId) {
    return null;
  }

  const match = DEMO_APPLICATIONS.find(application => application.id === applicationId);
  return match
    ? {
        ...match,
        skillsSnapshot: [...match.skillsSnapshot],
        milestones: match.milestones.map(milestone => ({ ...milestone }))
      }
    : null;
}
