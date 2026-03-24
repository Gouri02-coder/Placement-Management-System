export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  type: 'fulltime' | 'parttime' | 'internship';
  location: 'remote' | 'hybrid' | 'onsite';
  category: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    type: 'fixed' | 'range';
  };
  stipend?: number;
  eligibility: {
    branches: string[];
    minCGPA: number;
    yearOfPassing: number[];
    requiredSkills: string[];
    additionalRequirements?: string;
  };
  applicationDeadline: Date;
  status: 'draft' | 'active' | 'closed' | 'expired';
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobCreateRequest {
  title: string;
  description: string;
  type: 'fulltime' | 'parttime' | 'internship';
  location: 'remote' | 'hybrid' | 'onsite';
  category: string;
  status: 'draft' | 'active' | 'closed' | 'expired';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  stipend?: number;
  eligibility: {
    branches: string[];
    minCGPA: number;
    yearOfPassing: number[];
    requiredSkills: string[];
    additionalRequirements?: string;
  };
  applicationDeadline: Date;
}