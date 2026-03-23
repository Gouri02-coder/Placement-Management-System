import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  overviewCards = [
    { label: 'Registered Students', value: '1,284', trend: '+12%' },
    { label: 'Active Companies', value: '86', trend: '+8%' },
    { label: 'Open Roles', value: '214', trend: '+5%' },
    { label: 'Placements This Month', value: '73', trend: '+18%' }
  ];

  quickLinks = [
    { label: 'View All Students', route: '/admin/students/list' },
    { label: 'View Companies', route: '/admin/companies' },
    { label: 'View Placements', route: '/admin/placements' },
    { label: 'View Reports', route: '/admin/reports' },
    { label: 'System Monitoring', route: '/admin/monitoring' }
  ];

  pendingTasks = [
    { title: 'Verify 12 company profiles', priority: 'high' },
    { title: 'Review 7 new drive requests', priority: 'medium' },
    { title: 'Approve 19 student documents', priority: 'low' }
  ];

  recentEvents = [
    { event: 'Placement drive scheduled by Nexora Labs', time: '15 mins ago' },
    { event: 'New company ByteCraft completed verification', time: '1 hour ago' },
    { event: 'Admin exported monthly placement report', time: '3 hours ago' }
  ];
}
