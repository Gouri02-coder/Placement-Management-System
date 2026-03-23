export interface DashboardStats {
  totalStudents: number;
  studentsGrowth: number;
  totalCompanies: number;
  companiesGrowth: number;
  openRoles: number;
  rolesGrowth: number;
  placementsThisMonth: number;
  placementsGrowth: number;
  pendingCompanyApprovals: number;
  pendingStudentVerifications: number;
  upcomingDrives: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: string;
  user?: string;
  action?: string;
}

export interface QuickAction {
  title: string;
  route: string;
  icon: string;
  color: string;
  badge: string;
  count?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}