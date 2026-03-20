import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface AdminNavItem {
  label: string;
  route: string;
  hint: string;
  icon: 'dashboard' | 'students' | 'companies' | 'approval' | 'drives' | 'schedule' | 'reports';
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  navItems: AdminNavItem[] = [
    { label: 'Admin Dashboard', route: '/admin/dashboard', hint: 'Overview and actions', icon: 'dashboard' },
    { label: 'View All Students', route: '/admin/students/list', hint: 'Search and review student records', icon: 'students' },
    { label: 'View Companies', route: '/admin/companies', hint: 'Company approvals and details', icon: 'companies' },
    { label: 'Approve Companies', route: '/admin/companies/approval', hint: 'Pending verification queue', icon: 'approval' },
    { label: 'Manage Drives', route: '/admin/drives/management', hint: 'Placement drive operations', icon: 'drives' },
    { label: 'Drive Schedule', route: '/admin/drives/schedule', hint: 'Upcoming drive calendar', icon: 'schedule' },
    { label: 'View Reports', route: '/admin/reports', hint: 'Analytics and exports', icon: 'reports' }
  ];

  currentPath = '/admin/dashboard';
  sidebarCollapsed = false;

  constructor(private router: Router) {
    this.currentPath = this.router.url;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentPath = event.urlAfterRedirects;
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  trackNav(_: number, item: AdminNavItem): string {
    return item.route;
  }
}
