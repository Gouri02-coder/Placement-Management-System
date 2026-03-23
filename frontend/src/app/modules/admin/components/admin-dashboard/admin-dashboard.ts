import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface OverviewCard {
  label: string;
  value: string;
  trend: string;
  icon: 'students' | 'companies' | 'drives' | 'reports';
}

interface QuickLink {
  label: string;
  route: string;
}

interface PendingTask {
  title: string;
  priority: 'high' | 'medium' | 'low';
  route: string;
}

interface RecentEvent {
  event: string;
  time: string;
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
    { label: 'Active Drives', value: '24', trend: '+5%', icon: 'drives' },
    { label: 'Reports Generated', value: '73', trend: '+18%', icon: 'reports' }
  ];

  quickLinks: QuickLink[] = [
    { label: 'View All Students', route: '/admin/students/list' },
    { label: 'View Companies', route: '/admin/companies' },
    { label: 'Approve Companies', route: '/admin/companies/approval' },
    { label: 'Manage Drives', route: '/admin/drives/management' },
    { label: 'View Reports', route: '/admin/reports' }
  ];

  pendingTasks: PendingTask[] = [
    { title: 'Verify 12 company profiles', priority: 'high', route: '/admin/companies/approval' },
    { title: 'Review 7 new drive requests', priority: 'medium', route: '/admin/drives/schedule' },
    { title: 'Approve 19 student documents', priority: 'low', route: '/admin/students/list' }
  ];

  recentEvents: RecentEvent[] = [
    { event: 'Placement drive scheduled by Nexora Labs', time: '15 mins ago' },
    { event: 'New company ByteCraft completed verification', time: '1 hour ago' },
    { event: 'Admin exported monthly placement report', time: '3 hours ago' }
  ];

  constructor(private router: Router) {}

  openReports(): void {
    this.router.navigate(['/admin/reports']);
  }

  reviewTask(route: string): void {
    this.router.navigate([route]);
  }
}
