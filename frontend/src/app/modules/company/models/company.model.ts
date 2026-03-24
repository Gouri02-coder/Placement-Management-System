export interface HRContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  isPrimary?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface VerificationDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
  status: 'pending' | 'verified' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
}

export interface CompanyStatistics {
  totalApplications: number;
  activeJobPostings: number;
  interviewsScheduled: number;
  profileCompletion: number;
  totalViews?: number;
  responseRate?: number;
}

export interface ChangeHistory {
  id: string;
  field: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  changedAt: Date;
  ipAddress?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  website: string;
  address: string;
  description: string;
  hrContacts: HRContact[];
  socialLinks: SocialLinks;
  verificationDocuments: VerificationDocument[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  verifiedAt?: Date;
  verifiedBy?: string;
  verificationNotes?: string;
  tags?: string[];
  industry?: string;
  foundedYear?: number;
  employeeCount?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationStatus {
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  notes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  nextReviewDate?: Date;
}

export interface ExportOptions {
  format: 'pdf' | 'json' | 'csv';
  includeDocuments: boolean;
  includeHistory: boolean;
  includeStatistics: boolean;
}