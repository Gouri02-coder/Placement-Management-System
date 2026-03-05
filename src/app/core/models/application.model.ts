import { Student } from './student.model';
import { Job } from './job.model';

export interface Application {
  id?: number;
  student?: Student;
  job?: Job;
  appliedDate?: string; // Standard format for Java LocalDate
  status: ApplicationStatus | string;
  
  // Required for PTO Module to track drive attendance
  attendanceStatus?: string; 

  /* * NOTE: If you want to keep the fields below, 
   * we MUST add them to your Spring Boot Application.java entity 
   * and update your MySQL database table.
   */
  // coverLetter?: string;
  // resumeUrl?: string;
  // remarks?: string;
}

export enum ApplicationStatus {
  // Matched to common backend string values
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  SELECTED = 'SELECTED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED'
}

export interface ApplicationUpdate {
  status: ApplicationStatus | string;
  attendanceStatus?: string;
}