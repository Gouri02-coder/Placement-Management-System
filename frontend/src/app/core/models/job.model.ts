export interface Job {
  id: number;
  companyId: number;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skillsRequired: string[];
  location: string;
  type: JobType;
  category: JobCategory;
  salary: Salary;
  experience: Experience;
  vacancies: number;
  applicationDeadline: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Salary {
  min: number;
  max: number;
  currency: string;
  isNegotiable: boolean;
}

export interface Experience {
  min: number;
  max: number;
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  CONTRACT = 'contract'
}

export enum JobCategory {
  IT = 'it',
  ENGINEERING = 'engineering',
  BUSINESS = 'business',
  DESIGN = 'design',
  MARKETING = 'marketing',
  OTHER = 'other'
}

export interface JobApplicationRequest {
  jobId: number;
  studentId: number;
  coverLetter?: string;
}