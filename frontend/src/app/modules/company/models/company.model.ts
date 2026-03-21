export interface Company {
  id: string;
  name: string;
  logo: string;
  website: string;
  address: string;
  description: string;
  hrContact: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyStats {
  activeJobs: number;
  totalApplications: number;
  localHires: number;
  pendingReviews: number;
  upcomingDrives: number;
  unreadNotifications: number;
}