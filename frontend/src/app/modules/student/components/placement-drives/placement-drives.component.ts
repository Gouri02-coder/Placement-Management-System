import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { StudentService } from '../../services/student.service';

interface StudentDriveProfile {
  id: string;
  name: string;
  branch: string;
  cgpa: number;
  activeBacklogs: number;
  graduationYear: number;
  skills: string[];
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  jobTitle: string;
  description: string;
  eligibility: {
    minCGPA: number;
    allowedBranches: string[];
    backlogAllowed: boolean;
    maxActiveBacklogs: number;
    graduationYears: number[];
    preferredSkills: string[];
  };
  package: string;
  location: string;
  driveDate: Date;
  registrationDeadline: Date;
  mode: 'On Campus' | 'Virtual' | 'Hybrid';
  openings: number;
  registeredStudents: string[];
}

interface DriveEvaluation {
  eligible: boolean;
  reasons: string[];
  matchedSkills: string[];
}

const BRANCH_ALIASES: Record<string, string[]> = {
  'computer science': ['computer science', 'computer science and engineering', 'cse', 'cs'],
  'information technology': ['information technology', 'it', 'information science'],
  'electronics and communication': ['electronics and communication', 'electronics & communication', 'ece'],
  'electrical engineering': ['electrical engineering', 'ee'],
  'mechanical engineering': ['mechanical engineering', 'me']
};

@Component({
  selector: 'app-placement-drives',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, DatePipe],
  templateUrl: './placement-drives.component.html',
  styleUrls: ['./placement-drives.component.css']
})
export class PlacementDrivesComponent implements OnInit {
  studentId = '123';
  showOnlyEligible = true;
  searchTerm = '';
  statusFilter: 'all' | 'eligible' | 'registered' | 'closed' | 'ineligible' = 'all';
  modeFilter: 'all' | PlacementDrive['mode'] = 'all';
  visibleDrives: PlacementDrive[] = [];

  studentProfile: StudentDriveProfile = {
    id: '',
    name: 'Student',
    branch: 'Branch not available',
    cgpa: 0,
    activeBacklogs: 0,
    graduationYear: new Date().getFullYear(),
    skills: []
  };

  placementDrives: PlacementDrive[] = [
    {
      id: 'drv-101',
      companyName: 'Tech Corp',
      jobTitle: 'Software Engineer',
      description: 'Build product features with modern frontend and backend stacks for a scaled campus hiring program.',
      eligibility: {
        minCGPA: 7.5,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electronics and Communication'],
        backlogAllowed: false,
        maxActiveBacklogs: 0,
        graduationYears: [2025, 2026, 2027],
        preferredSkills: ['JavaScript', 'Angular', 'SQL']
      },
      package: '12 LPA',
      location: 'Bangalore',
      driveDate: new Date('2026-04-12'),
      registrationDeadline: new Date('2026-04-08'),
      mode: 'On Campus',
      openings: 32,
      registeredStudents: []
    },
    {
      id: 'drv-102',
      companyName: 'DataSpring Analytics',
      jobTitle: 'Data Analyst Trainee',
      description: 'Work on dashboards, BI pipelines, reporting, and business analysis for enterprise accounts.',
      eligibility: {
        minCGPA: 7.0,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electrical Engineering', 'Mechanical Engineering'],
        backlogAllowed: true,
        maxActiveBacklogs: 1,
        graduationYears: [2025, 2026, 2027],
        preferredSkills: ['SQL', 'Python', 'Excel']
      },
      package: '8.5 LPA',
      location: 'Hyderabad',
      driveDate: new Date('2026-04-16'),
      registrationDeadline: new Date('2026-04-13'),
      mode: 'Hybrid',
      openings: 24,
      registeredStudents: ['student900']
    },
    {
      id: 'drv-103',
      companyName: 'EmbeddedX',
      jobTitle: 'Embedded Systems Graduate Engineer',
      description: 'Join the hardware systems team working on firmware validation and board-level integration.',
      eligibility: {
        minCGPA: 8.0,
        allowedBranches: ['Electronics and Communication', 'Electrical Engineering'],
        backlogAllowed: false,
        maxActiveBacklogs: 0,
        graduationYears: [2025, 2026, 2027],
        preferredSkills: ['C', 'Embedded Systems']
      },
      package: '10 LPA',
      location: 'Pune',
      driveDate: new Date('2026-04-20'),
      registrationDeadline: new Date('2026-04-15'),
      mode: 'On Campus',
      openings: 18,
      registeredStudents: []
    },
    {
      id: 'drv-104',
      companyName: 'CloudArc',
      jobTitle: 'Associate Cloud Support Engineer',
      description: 'Support cloud onboarding, automation workflows, and client deployment troubleshooting.',
      eligibility: {
        minCGPA: 7.8,
        allowedBranches: ['Computer Science', 'Information Technology'],
        backlogAllowed: false,
        maxActiveBacklogs: 0,
        graduationYears: [2025, 2026, 2027],
        preferredSkills: ['Linux', 'Networking', 'JavaScript']
      },
      package: '9.2 LPA',
      location: 'Chennai',
      driveDate: new Date('2026-04-25'),
      registrationDeadline: new Date('2026-04-22'),
      mode: 'Virtual',
      openings: 20,
      registeredStudents: ['student123']
    }
  ];

  selectedDriveId = '';

  constructor(
    private authService: AuthService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser?.id) {
      this.studentId = currentUser.id.toString();
      this.loadStudentProfile(this.studentId);
    }

    this.applyFilters();
  }

  private loadStudentProfile(studentId: string): void {
    this.studentService.getStudentProfile(studentId).subscribe({
      next: (student) => {
        this.studentProfile = {
          id: student.id,
          name: `${student.personalInfo?.firstName || ''} ${student.personalInfo?.lastName || ''}`.trim() || 'Student',
          branch: student.academicInfo?.branch || 'Branch not available',
          cgpa: student.academicInfo?.cgpa || 0,
          activeBacklogs: 0,
          graduationYear: student.academicInfo?.graduationYear || new Date().getFullYear(),
          skills: student.skills || []
        };
        this.applyFilters();
      },
      error: () => {
        const fallbackUser = this.authService.currentUserValue;
        if (fallbackUser) {
          this.studentProfile = {
            ...this.studentProfile,
            id: fallbackUser.id,
            name: fallbackUser.name || 'Student'
          };
        }
        this.applyFilters();
      }
    });
  }

  get selectedDrive(): PlacementDrive | null {
    return this.visibleDrives.find((drive) => drive.id === this.selectedDriveId) ?? this.visibleDrives[0] ?? null;
  }

  get selectedDriveEvaluation(): DriveEvaluation | null {
    return this.selectedDrive ? this.evaluateDrive(this.selectedDrive) : null;
  }

  get totalDriveCount(): number {
    return this.placementDrives.length;
  }

  get eligibleDriveCount(): number {
    return this.placementDrives.filter((drive) => this.evaluateDrive(drive).eligible && this.canRegister(drive)).length;
  }

  get registeredDriveCount(): number {
    return this.placementDrives.filter((drive) => this.isRegistered(drive.id)).length;
  }

  get closingSoonCount(): number {
    return this.placementDrives.filter((drive) => this.canRegister(drive) && this.getDaysUntil(drive.registrationDeadline) <= 7).length;
  }

  selectDrive(driveId: string): void {
    this.selectedDriveId = driveId;
  }

  toggleEligibleFilter(): void {
    this.showOnlyEligible = !this.showOnlyEligible;
    this.applyFilters();
  }

  registerForDrive(driveId: string): void {
    const drive = this.placementDrives.find((item) => item.id === driveId);
    if (!drive || this.isRegistered(driveId) || !this.canRegister(drive) || !this.evaluateDrive(drive).eligible) {
      return;
    }

    drive.registeredStudents = [...drive.registeredStudents, this.studentId];
    this.applyFilters();
    this.selectedDriveId = driveId;
  }

  isRegistered(driveId: string): boolean {
    const drive = this.placementDrives.find((item) => item.id === driveId);
    return drive ? drive.registeredStudents.includes(this.studentId) : false;
  }

  canRegister(drive: PlacementDrive): boolean {
    return new Date() <= drive.registrationDeadline;
  }

  evaluateDrive(drive: PlacementDrive): DriveEvaluation {
    const reasons: string[] = [];
    const normalizedBranch = this.normalizeBranch(this.studentProfile.branch);
    const allowedBranches = drive.eligibility.allowedBranches.map((branch) => this.normalizeBranch(branch));
    const batchEligible = drive.eligibility.graduationYears.includes(this.studentProfile.graduationYear);

    if (this.studentProfile.cgpa < drive.eligibility.minCGPA) {
      reasons.push(`CGPA should be at least ${drive.eligibility.minCGPA.toFixed(1)}.`);
    }

    if (!allowedBranches.includes(normalizedBranch)) {
      reasons.push(`Eligible branches: ${drive.eligibility.allowedBranches.join(', ')}.`);
    }

    if (!drive.eligibility.backlogAllowed && this.studentProfile.activeBacklogs > 0) {
      reasons.push('This drive does not allow active backlogs.');
    }

    if (this.studentProfile.activeBacklogs > drive.eligibility.maxActiveBacklogs) {
      reasons.push(`Only ${drive.eligibility.maxActiveBacklogs} active backlog(s) allowed.`);
    }

    if (!batchEligible) {
      reasons.push(`Eligible graduating batches: ${drive.eligibility.graduationYears.join(', ')}.`);
    }

    const matchedSkills = drive.eligibility.preferredSkills.filter((skill) =>
      this.studentProfile.skills.some((studentSkill) => studentSkill.toLowerCase() === skill.toLowerCase())
    );

    return {
      eligible: reasons.length === 0,
      reasons,
      matchedSkills
    };
  }

  private normalizeBranch(branch: string): string {
    const normalized = branch.trim().toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ');

    const match = Object.entries(BRANCH_ALIASES).find(([, aliases]) => aliases.includes(normalized));
    return match ? match[0] : normalized;
  }

  getDriveStatus(drive: PlacementDrive): 'registered' | 'eligible' | 'closed' | 'ineligible' {
    if (this.isRegistered(drive.id)) {
      return 'registered';
    }

    if (!this.canRegister(drive)) {
      return 'closed';
    }

    return this.evaluateDrive(drive).eligible ? 'eligible' : 'ineligible';
  }

  getDriveStatusLabel(drive: PlacementDrive): string {
    const status = this.getDriveStatus(drive);

    if (status === 'registered') {
      return 'Registered';
    }

    if (status === 'closed') {
      return 'Closed';
    }

    if (status === 'eligible') {
      return 'Eligible';
    }

    return 'Not Eligible';
  }

  getDeadlineLabel(drive: PlacementDrive): string {
    if (!this.canRegister(drive)) {
      return `Closed on ${this.formatDateLabel(drive.registrationDeadline)}`;
    }

    const daysUntil = this.getDaysUntil(drive.registrationDeadline);
    if (daysUntil <= 0) {
      return 'Closes today';
    }

    if (daysUntil === 1) {
      return 'Closes in 1 day';
    }

    return `Closes in ${daysUntil} days`;
  }

  applyFilters(): void {
    const searchValue = this.searchTerm.trim().toLowerCase();

    this.visibleDrives = this.placementDrives
      .filter((drive) => !this.showOnlyEligible || this.evaluateDrive(drive).eligible)
      .filter((drive) => this.statusFilter === 'all' || this.getDriveStatus(drive) === this.statusFilter)
      .filter((drive) => this.modeFilter === 'all' || drive.mode === this.modeFilter)
      .filter((drive) => {
        if (!searchValue) {
          return true;
        }

        return [
          drive.companyName,
          drive.jobTitle,
          drive.description,
          drive.location,
          drive.package,
          drive.mode
        ].some((value) => value.toLowerCase().includes(searchValue));
      })
      .sort((left, right) => left.registrationDeadline.getTime() - right.registrationDeadline.getTime());

    this.ensureSelectedDrive();
  }

  private ensureSelectedDrive(): void {
    if (this.visibleDrives.some((drive) => drive.id === this.selectedDriveId)) {
      return;
    }

    this.selectedDriveId = this.visibleDrives[0]?.id ?? '';
  }

  private getDaysUntil(date: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((date.getTime() - Date.now()) / millisecondsPerDay);
  }

  private formatDateLabel(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
}
