export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
}

export interface AcademicInfo {
  college: string;
  degree: string;
  branch: string;
  semester: number;
  cgpa: number;
  graduationYear: number;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;  
  startDate: Date;
  endDate: Date;
  percentage: number;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  githubLink?: string;
}

export interface Student {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  education: Education[];
  projects: Project[];
  skills: string[];
  resumeUrl: string;
  profilePhoto: string;
  createdAt: Date;
  updatedAt: Date;
}