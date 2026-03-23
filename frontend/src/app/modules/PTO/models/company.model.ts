export type CompanyApprovalStatus = 'Approved' | 'Pending' | 'Under Review' | 'Needs Clarification';

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  roleCount: number;
  activeDriveCount: number;
  status: CompanyApprovalStatus;
}

export interface CompanyProfile extends Company {
  contactName: string;
  contactRole: string;
  contactEmail: string;
  campusCoordinator: string;
  description: string;
}
