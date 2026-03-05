export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  studentId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string; 
  branch: string;
  cgpa: number;
  yearOfPassing: number; 
  skills: string[];
  resumeUrl: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: Date; 
  updatedAt: Date;
}
export interface ApplicationFilter {
  jobId?: string;
  status?: string;
  branch?: string;
  minCGPA?: number;
  skills?: string[];
}

export interface ApplicationStatusUpdate {
  applicationId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
}