export type StudentVerificationStatus = 'Pending' | 'Approved' | 'Needs Review';

export interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  cgpa: number;
  placementStatus: 'Ready' | 'In Progress' | 'Placed';
  verificationStatus: StudentVerificationStatus;
  email: string;
}

export interface StudentProfile extends Student {
  phone: string;
  skills: string[];
  documentsPending: number;
  resumeScore: number;
}
