import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

type CompanyStatus = 'approved' | 'pending' | 'rejected';

interface CompanyProfile {
  name: string;
  logo: string;
  status: CompanyStatus;
}

interface DashboardStats {
  activeJobs: number;
  totalApplications: number;
  upcomingDrives: number;
  unreadNotifications: number;
}

@Component({
  selector: 'app-company-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe],
  templateUrl: './company-layout.html',
  styleUrl: './company-layout.css'
})
export class CompanyLayoutComponent {
  companyProfile: CompanyProfile = {
    name: 'Company Workspace',
    logo: '',
    status: 'pending'
  };

  dashboardStats: DashboardStats = {
    activeJobs: 6,
    totalApplications: 24,
    upcomingDrives: 3,
    unreadNotifications: 5
  };

  activeSection = 'dashboard';
  userName = 'Company Admin';
  userRole = 'Recruitment Team';

  constructor(private router: Router) {}

  navigateTo(section: string): void {
    this.activeSection = section;
    void this.router.navigate(['/company', section]);
  }

  getStatusClass(): string {
    return `status-${this.companyProfile.status}`;
  }

  getNotificationCount(): number {
    return this.dashboardStats.unreadNotifications;
  }

  takeScreenshot(): void {
    window.print();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    void this.router.navigate(['/auth/login']);
  }
}
