import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company, CompanyStats } from '../../models/company.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './company-dash-board.html',
  styleUrls: ['./company-dash-board.css']
})
export class CompanyDashboardComponent implements OnInit {
  userName: string = '';
  userRole: string = 'HR Manager';
  activeSection: string = 'dashboard';
  
  companyProfile: Company = {
    id: '',
    name: '',
    logo: '',
    website: '',
    address: '',
    description: '',
    hrContact: {
      name: '',
      email: '',
      phone: '',
      position: ''
    },
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  dashboardStats: CompanyStats = {
    activeJobs: 0,
    totalApplications: 0,
    localHires: 0,
    pendingReviews: 0,
    upcomingDrives: 0,
    unreadNotifications: 0
  };

  recentActivities = [
    {
      type: 'success',
      icon: 'check_circle',
      message: 'Job "Frontend Developer" published successfully',
      time: '2 hours ago'
    },
    {
      type: 'info',
      icon: 'info',
      message: '5 new applications received for "Data Analyst" position',
      time: '5 hours ago'
    },
    {
      type: 'warning',
      icon: 'warning',
      message: '3 applications pending review for over 7 days',
      time: '1 day ago'
    }
  ];

  constructor(
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCompanyProfile();
    this.loadCompanyStats();
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.name;
      this.userRole = user.role || 'HR Manager';
    }
  }

  private loadCompanyProfile(): void {
    const companyId = this.getCompanyId();
    this.companyService.getCompanyProfile(companyId).subscribe({
      next: (profile) => {
        this.companyProfile = profile;
      },
      error: (error) => {
        console.error('Error loading company profile:', error);
      }
    });
  }

  private loadCompanyStats(): void {
    const companyId = this.getCompanyId();
    this.companyService.getCompanyStats(companyId).subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (error) => {
        console.error('Error loading company stats:', error);
      }
    });
  }

  private getCompanyId(): string {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).companyId : '';
  }

  switchSection(section: string): void {
    this.activeSection = section;
    const routes = {
      dashboard: '/company/dashboard',
      profile: '/company/profile',
      jobs: '/company/jobs',
      applications: '/company/applications',
      drives: '/company/drives',
      analytics: '/company/analytics',
      communication: '/company/communication'
    };
    
    if (routes[section as keyof typeof routes]) {
      this.router.navigate([routes[section as keyof typeof routes]]);
    }
  }

  postJob(): void {
    this.router.navigate(['/company/jobs/post']);
  }

  manageJobs(): void {
    this.router.navigate(['/company/jobs']);
  }

  viewApplications(): void {
    this.router.navigate(['/company/applications']);
  }

  scheduleDrive(): void {
    this.router.navigate(['/company/drives/schedule']);
  }

  viewAnalytics(): void {
    this.router.navigate(['/company/analytics']);
  }

  editProfile(): void {
    this.router.navigate(['/company/profile']);
  }

  viewNotifications(): void {
    this.router.navigate(['/company/notifications']);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getNotificationCount(): number {
    return this.dashboardStats.unreadNotifications;
  }

  // Screenshot feature simulation
  takeScreenshot(): void {
    console.log('Taking screenshot of dashboard...');
    // In a real implementation, this would use html2canvas or similar library
    alert('Screenshot feature would capture the current dashboard view');
  }
}