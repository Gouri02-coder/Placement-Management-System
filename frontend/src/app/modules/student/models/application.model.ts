export type ApplicationStatus = 
  | 'draft' 
  | 'applied' 
  | 'under-review' 
  | 'shortlisted' 
  | 'interview-scheduled' 
  | 'interview-completed' 
  | 'offer-extended' 
  | 'offer-accepted' 
  | 'offer-declined' 
  | 'rejected' 
  | 'withdrawn';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  companyId: string;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  jobType: string;
  appliedDate: Date;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl: string;
  notes?: string;
  interview?: {
    scheduledDate?: Date;
    interviewType: 'technical' | 'hr' | 'managerial' | 'group';
    round: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    feedback?: string;
  };
  timeline: any[];
}