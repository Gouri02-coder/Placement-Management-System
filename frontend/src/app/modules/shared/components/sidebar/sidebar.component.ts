import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService, User } from '../../../../core/services/auth.service';

interface SidebarItem {
  label: string;
  route: string;
  icon: string;
  roles: Array<User['role']>;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  currentUser: User | null = null;
  currentRoute = '';
  expandedItems: Set<string> = new Set();

  sidebarItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      route: '/student/dashboard',
      icon: 'SD',
      roles: ['student']
    },
    {
      label: 'Job Search',
      route: '/student/jobs',
      icon: 'JS',
      roles: ['student']
    },
    {
      label: 'My Applications',
      route: '/student/applications',
      icon: 'AP',
      roles: ['student']
    },
    {
      label: 'Interviews',
      route: '/student/interviews',
      icon: 'IN',
      roles: ['student']
    },
    {
      label: 'My Profile',
      route: '/student/profile',
      icon: 'PR',
      roles: ['student'],
      children: [
        { label: 'Personal Info', route: '/student/profile/personal', icon: 'PI', roles: ['student'] },
        { label: 'Resume', route: '/student/profile/resume', icon: 'RE', roles: ['student'] },
        { label: 'Education', route: '/student/profile/education', icon: 'ED', roles: ['student'] },
        { label: 'Skills', route: '/student/profile/skills', icon: 'SK', roles: ['student'] }
      ]
    },
    {
      label: 'Dashboard',
      route: '/company/dashboard',
      icon: 'CD',
      roles: ['company']
    },
    {
      label: 'Job Postings',
      route: '/company/jobs',
      icon: 'JP',
      roles: ['company'],
      children: [
        { label: 'All Jobs', route: '/company/jobs/list', icon: 'AJ', roles: ['company'] },
        { label: 'Post New Job', route: '/company/jobs/create', icon: 'NJ', roles: ['company'] }
      ]
    },
    {
      label: 'Applications',
      route: '/company/applications',
      icon: 'CA',
      roles: ['company']
    },
    {
      label: 'Interviews',
      route: '/company/interviews',
      icon: 'CI',
      roles: ['company']
    },
    {
      label: 'Company Profile',
      route: '/company/profile',
      icon: 'CP',
      roles: ['company']
    },
    {
      label: 'Dashboard',
      route: '/admin/dashboard',
      icon: 'AD',
      roles: ['admin']
    },
    {
      label: 'Companies',
      route: '/admin/companies',
      icon: 'CO',
      roles: ['admin'],
      children: [
        { label: 'All Companies', route: '/admin/companies', icon: 'AC', roles: ['admin'] },
        { label: 'Company Approval', route: '/admin/companies/approval', icon: 'CA', roles: ['admin'] },
        { label: 'Company Details', route: '/admin/companies/details', icon: 'CD', roles: ['admin'] }
      ]
    },
    {
      label: 'Drives',
      route: '/admin/drives',
      icon: 'DR',
      roles: ['admin'],
      children: [
        { label: 'Drive Management', route: '/admin/drives/management', icon: 'DM', roles: ['admin'] },
        { label: 'Schedule Drive', route: '/admin/drives/schedule', icon: 'DS', roles: ['admin'] }
      ]
    },
    {
      label: 'Students',
      route: '/admin/students',
      icon: 'ST',
      roles: ['admin'],
      children: [
        { label: 'Student List', route: '/admin/students/list', icon: 'SL', roles: ['admin'] },
        { label: 'Student Details', route: '/admin/students/details', icon: 'SD', roles: ['admin'] }
      ]
    },
    {
      label: 'Reports',
      route: '/admin/reports',
      icon: 'RP',
      roles: ['admin']
    },
    {
      label: 'Settings',
      route: '/admin/settings',
      icon: 'SE',
      roles: ['admin']
    },
    {
      label: 'Dashboard',
      route: '/placement/dashboard',
      icon: 'PD',
      roles: ['placement-officer']
    },
    {
      label: 'Verify Students',
      route: '/placement/verify-students',
      icon: 'VS',
      roles: ['placement-officer']
    },
    {
      label: 'Verify Companies',
      route: '/placement/verify-companies',
      icon: 'VC',
      roles: ['placement-officer']
    },
    {
      label: 'Monitor Placements',
      route: '/placement/monitor-placements',
      icon: 'MP',
      roles: ['placement-officer']
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.currentRoute = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects || event.url;
        this.autoExpandActiveItems();
      });

    this.autoExpandActiveItems();
  }

  get filteredItems(): SidebarItem[] {
    if (!this.currentUser) {
      return [];
    }

    return this.sidebarItems.filter(item => item.roles.includes(this.currentUser!.role));
  }

  toggleItem(item: SidebarItem): void {
    if (!item.children || item.children.length === 0) {
      return;
    }

    if (this.expandedItems.has(item.route)) {
      this.expandedItems.delete(item.route);
      return;
    }

    this.expandedItems.add(item.route);
  }

  isItemExpanded(item: SidebarItem): boolean {
    return this.expandedItems.has(item.route);
  }

  hasActiveChild(item: SidebarItem): boolean {
    if (!item.children) {
      return false;
    }

    return item.children.some(child => this.isActiveRoute(child.route));
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  private autoExpandActiveItems(): void {
    this.expandedItems.clear();

    this.filteredItems.forEach(item => {
      if (item.children && this.hasActiveChild(item)) {
        this.expandedItems.add(item.route);
      }
    });
  }

  onToggleCollapse(): void {
    this.toggleCollapse.emit();

    if (this.isCollapsed) {
      this.expandedItems.clear();
    }
  }

  getRoleDisplayName(): string {
    if (!this.currentUser) {
      return '';
    }

    const roleMap: Record<User['role'], string> = {
      student: 'Student',
      admin: 'Admin',
      company: 'Company',
      'placement-officer': 'Placement Officer'
    };

    return roleMap[this.currentUser.role] || this.currentUser.role;
  }
}
