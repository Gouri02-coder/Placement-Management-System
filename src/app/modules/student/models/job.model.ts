export interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'internship';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  applicationDeadline: Date;
  positions: number;
  status: 'active' | 'closed';
  postedDate: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  appliedDate: Date;
  status: 'applied' | 'under-review' | 'shortlisted' | 'rejected' | 'selected';
  coverLetter?: string;
  resumeUrl: string;
  interviewDate?: Date;
  
  // Add these missing properties that your template uses
  jobTitle: string;
  companyName: string;
}