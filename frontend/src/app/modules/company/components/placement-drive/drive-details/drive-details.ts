import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompanyDriveRecord, CompanyDriveRole, getCompanyDrives } from '../../../data/company-drive.data';

type DriveWorkspaceTab = 'overview' | 'roles' | 'operations';

@Component({
  selector: 'app-drive-details',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './drive-details.html',
  styleUrl: './drive-details.css',
})
export class DriveDetails implements OnInit {
  driveId: string | null = null;
  drive: CompanyDriveRecord | null = null;
  isLoading = true;
  error: string | null = null;
  activeTab: DriveWorkspaceTab = 'overview';
  saveState: 'idle' | 'saving' | 'saved' = 'idle';
  workspaceNotice = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.driveId = params.get('id');
      if (this.driveId) {
        this.loadDriveDetails();
      } else {
        this.error = 'Drive ID not found';
        this.isLoading = false;
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      const requestedTab = params.get('tab');
      if (requestedTab === 'overview' || requestedTab === 'roles' || requestedTab === 'operations') {
        this.activeTab = requestedTab;
      }
    });
  }

  private loadDriveDetails(): void {
    setTimeout(() => {
      const drives = getCompanyDrives();
      const currentDrive = drives.find((drive) => String(drive.id) === this.driveId);

      if (!currentDrive) {
        this.error = 'Drive not found';
        this.isLoading = false;
        return;
      }

      this.drive = structuredClone(currentDrive);
      this.isLoading = false;
    }, 250);
  }

  goBack(): void {
    this.router.navigate(['/company/drives']);
  }

  switchTab(tab: DriveWorkspaceTab): void {
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  saveDriveChanges(): void {
    this.saveState = 'saving';
    this.workspaceNotice = '';

    setTimeout(() => {
      this.saveState = 'saved';
      this.workspaceNotice = 'Drive settings updated in the company workspace demo.';
    }, 500);
  }

  duplicateDrive(): void {
    if (!this.drive) {
      return;
    }

    this.workspaceNotice = `${this.drive.driveName} was copied into a draft workspace.`;
  }

  addRolePost(): void {
    if (!this.drive) {
      return;
    }

    this.drive.roles.push({
      id: `role-${Date.now()}`,
      title: 'New Role Post',
      team: 'Hiring Team',
      openings: 1,
      targetApplications: 24,
      applications: 0,
      shortlisted: 0,
      interviews: 0,
      offers: 0,
      averagePackageLpa: 6.5,
      packageRange: 'INR 5.5-7.5 LPA',
      workMode: 'Hybrid',
      hiringManager: 'Assign Hiring Manager',
      skills: ['Skill 1', 'Skill 2'],
      responsibilities: [
        'Add role responsibilities here.',
        'Define screening expectations and interview plan.',
      ],
    });

    this.workspaceNotice = 'A new role post was added to this drive.';
    this.activeTab = 'roles';
  }

  removeRolePost(index: number): void {
    if (!this.drive || this.drive.roles.length === 1) {
      return;
    }

    const removedRole = this.drive.roles[index];
    this.drive.roles.splice(index, 1);
    this.workspaceNotice = `${removedRole.title} was removed from this drive draft.`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getTotalApplications(): number {
    if (!this.drive) {
      return 0;
    }

    return this.drive.roles.reduce((count, role) => count + role.applications, 0);
  }

  getTotalShortlisted(): number {
    if (!this.drive) {
      return 0;
    }

    return this.drive.roles.reduce((count, role) => count + role.shortlisted, 0);
  }

  getTotalInterviews(): number {
    if (!this.drive) {
      return 0;
    }

    return this.drive.roles.reduce((count, role) => count + role.interviews, 0);
  }

  getTotalOffers(): number {
    if (!this.drive) {
      return 0;
    }

    return this.drive.roles.reduce((count, role) => count + role.offers, 0);
  }

  getOfferRate(): number {
    const applications = this.getTotalApplications();
    return applications > 0 ? (this.getTotalOffers() / applications) * 100 : 0;
  }

  getRoleFillRate(role: CompanyDriveRole): number {
    return role.openings > 0 ? Math.min((role.offers / role.openings) * 100, 100) : 0;
  }

  getRolePipelineRate(role: CompanyDriveRole): number {
    return role.targetApplications > 0 ? Math.min((role.applications / role.targetApplications) * 100, 100) : 0;
  }

  getTopRole(): CompanyDriveRole | null {
    if (!this.drive || this.drive.roles.length === 0) {
      return null;
    }

    return [...this.drive.roles].sort((left, right) => right.applications - left.applications)[0];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'status-scheduled';
      case 'ongoing':
        return 'status-ongoing';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getDriveTypeLabel(type: CompanyDriveRecord['driveType']): string {
    switch (type) {
      case 'onCampus':
        return 'On-Campus';
      case 'offCampus':
        return 'Off-Campus';
      case 'virtual':
        return 'Virtual';
      case 'hybrid':
        return 'Hybrid';
      default:
        return type;
    }
  }

  getSaveButtonLabel(): string {
    if (this.saveState === 'saving') {
      return 'Saving...';
    }

    if (this.saveState === 'saved') {
      return 'Saved';
    }

    return 'Save Drive';
  }
}
