import { User } from './user.model';

export interface Student extends User {
  phone: string;
  department: string;
  course: string;
  year: number;
  cgpa: number;
  parentEmail: string; 
  rollNumber: string;
  resumeUrl?: string;
  skills: string[];
  projects?: Project[];
  education: Education[];
  address?: Address;
  placementStatus: PlacementStatus;
  verifiedByAdmin?: boolean;
  emailVerified?: boolean;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  githubUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  percentage: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum PlacementStatus {
  NOT_PLACED = 'not_placed',
  INTERVIEW = 'interview',
  SELECTED = 'selected',
  OFFERED = 'offered',
  PLACED = 'placed'
}