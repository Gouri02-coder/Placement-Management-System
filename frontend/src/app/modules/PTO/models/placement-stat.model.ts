export interface PlacementStat {
  label: string;
  value: string;
  note: string;
}

export interface CompanyReport {
  companyName: string;
  totalDrives: number;
  offersReleased: number;
  approvalStatus: string;
}

export interface StudentReport {
  department: string;
  totalStudents: number;
  verifiedStudents: number;
  placedStudents: number;
}
