import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface OverviewCard {
  label: string;
  value: string;
  trend: string;
  icon: 'students' | 'companies' | 'roles' | 'placements';
}

interface QuickLink {
  label: string;
  route: string;
  icon: 'students' | 'companies' | 'approval' | 'drives' | 'reports';
}

interface PendingTask {
  title: string;
  priority: 'high' | 'medium' | 'low';
  route: string;
  icon: 'approval' | 'schedule' | 'review';
}

interface RecentEvent {
  event: string;
  time: string;
  icon: 'schedule' | 'companies' | 'reports';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  overviewCards: OverviewCard[] = [
    { label: 'Registered Students', value: '1,284', trend: '+12%', icon: 'students' },
    { label: 'Active Companies', value: '86', trend: '+8%', icon: 'companies' },
    { label: 'Open Roles', value: '214', trend: '+5%', icon: 'roles' },
    { label: 'Placements This Month', value: '73', trend: '+18%', icon: 'placements' }
  ];

  quickLinks: QuickLink[] = [
    { label: 'View All Students', route: '/admin/students/list', icon: 'students' },
    { label: 'View Companies', route: '/admin/companies', icon: 'companies' },
    { label: 'Approve Companies', route: '/admin/companies/approval', icon: 'approval' },
    { label: 'Manage Drives', route: '/admin/drives/management', icon: 'drives' },
    { label: 'View Reports', route: '/admin/reports', icon: 'reports' }
  ];

  pendingTasks: PendingTask[] = [
    { title: 'Verify 12 company profiles', priority: 'high', route: '/admin/companies/approval', icon: 'approval' },
    { title: 'Review 7 new drive requests', priority: 'medium', route: '/admin/drives/schedule', icon: 'schedule' },
    { title: 'Approve 19 student documents', priority: 'low', route: '/admin/students/list', icon: 'review' }
  ];

  recentEvents: RecentEvent[] = [
    { event: 'Placement drive scheduled by Nexora Labs', time: '15 mins ago', icon: 'schedule' },
    { event: 'New company ByteCraft completed verification', time: '1 hour ago', icon: 'companies' },
    { event: 'Admin exported monthly placement report', time: '3 hours ago', icon: 'reports' }
  ];

  constructor(private router: Router) {}

  openReports(): void {
    this.router.navigate(['/admin/reports']);
  }

  reviewTask(route: string): void {
    this.router.navigate([route]);
  }
}
