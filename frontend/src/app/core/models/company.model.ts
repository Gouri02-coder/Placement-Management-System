import { User } from './user.model';
import { SocialLinks, VerificationDocument } from '../../modules/company/models/company.model';

export interface Company extends User {
  companyName: string;
  description: string;
  website: string;
  industry: string;
  employeeCount: number;
  foundedYear: number;
  headquarters: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  isVerified: boolean;
}

export interface CompanyRegistration {
  companyName: string;
  email: string;
  password: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
  website: string;
  description: string;
}

export interface CompanyProfile extends Company {
  hrContacts: HRContact[];
  socialLinks: SocialLinks;
  verificationDocuments: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface HRContact {
  name: string;
  email: string;
  phone: string;
  designation: string;
}

export interface CompanyStats {
  totalJobPostings: number;
  activeJobPostings: number;
  totalApplicants: number;
  averageTimeToHire: number; // in days
  topHiringDepartments: string[];
}