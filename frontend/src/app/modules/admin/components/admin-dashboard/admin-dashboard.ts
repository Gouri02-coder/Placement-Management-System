import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {
  AdminApprovalStoreService,
  ApprovalItem
} from '../../admin-approval-store.service';

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

  recentEvents: RecentEvent[] = [
    { event: 'Placement drive scheduled by Nexora Labs', time: '15 mins ago' },
    { event: 'New company ByteCraft completed verification', time: '1 hour ago' },
    { event: 'Admin exported monthly placement report', time: '3 hours ago' }
  ];

  constructor(
    private router: Router,
    private approvalStore: AdminApprovalStoreService
  ) {}

  get pendingApprovals(): ApprovalItem[] {
    return this.approvalStore.pendingApprovals;
  }

  openReports(): void {
    this.router.navigate(['/admin/reports']);
  }

  openApprovalQueue(): void {
    this.router.navigate(['/admin/companies/approval']);
  }

  reviewApproval(item: ApprovalItem): void {
    this.router.navigate(['/admin/companies/details', item.id]);
  }
}
