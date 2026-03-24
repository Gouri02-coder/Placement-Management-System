export type DriveStage = 'Planned' | 'Registration' | 'Assessment' | 'Interview' | 'Offer Rollout' | 'Completed';

export interface Drive {
  id: string;
  companyName: string;
  role: string;
  packageLpa: string;
  eligibleDepartments: string[];
  scheduledDate: string;
  stage: DriveStage;
  applicants: number;
}

export interface DriveFormDraft {
  companyName: string;
  role: string;
  packageLpa: string;
  scheduledDate: string;
  eligibleDepartments: string[];
  minimumCgpa: number;
}
