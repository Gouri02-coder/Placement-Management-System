import { User } from './user.model';

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