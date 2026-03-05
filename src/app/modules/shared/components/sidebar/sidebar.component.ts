import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

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
    // Student Routes
    {
      label: 'Dashboard',
      route: '/student/dashboard',
      icon: '📊',
      roles: ['student']
    },
    {
      label: 'Job Search',
      route: '/student/jobs',
      icon: '💼',
      roles: ['student']
    },
    {
      label: 'My Applications',
      route: '/student/applications',
      icon: '📝',
      roles: ['student']
    },
    {
      label: 'Interviews',
      route: '/student/interviews',
      icon: '🎯',
      roles: ['student']
    },
    {
      label: 'My Profile',
      route: '/student/profile',
      icon: '👤',
      roles: ['student'],
      children: [
        { label: 'Personal Info', route: '/student/profile/personal', icon: '📋', roles: ['student'] },
        { label: 'Resume', route: '/student/profile/resume', icon: '📄', roles: ['student'] },
        { label: 'Education', route: '/student/profile/education', icon: '🎓', roles: ['student'] },
        { label: 'Skills', route: '/student/profile/skills', icon: '⚡', roles: ['student'] }
      ]
    },

    // Company Routes
    {
      label: 'Dashboard',
      route: '/company/dashboard',
      icon: '📊',
      roles: ['company']
    },
    {
      label: 'Job Postings',
      route: '/company/jobs',
      icon: '💼',
      roles: ['company'],
      children: [
        { label: 'All Jobs', route: '/company/jobs/list', icon: '📋', roles: ['company'] },
        { label: 'Post New Job', route: '/company/jobs/create', icon: '➕', roles: ['company'] }
      ]
    },
    {
      label: 'Applications',
      route: '/company/applications',
      icon: '📝',
      roles: ['company']
    },
    {
      label: 'Interviews',
      route: '/company/interviews',
      icon: '🎯',
      roles: ['company']
    },
    {
      label: 'Company Profile',
      route: '/company/profile',
      icon: '🏢',
      roles: ['company']
    },

    // Admin Routes
    {
      label: 'Dashboard',
      route: '/admin/dashboard',
      icon: '📊',
      roles: ['admin']
    },
    {
      label: 'Companies',
      route: '/admin/companies',
      icon: '🏢',
      roles: ['admin'],
      children: [
        { label: 'All Companies', route: '/admin/companies', icon: '📋', roles: ['admin'] },
        { label: 'Company Approval', route: '/admin/companies/approval', icon: '✅', roles: ['admin'] },
        { label: 'Company Details', route: '/admin/companies/details', icon: '👁️', roles: ['admin'] }
      ]
    },
    {
      label: 'Drives',
      route: '/admin/drives',
      icon: '🚀',
      roles: ['admin'],
      children: [
        { label: 'Drive Management', route: '/admin/drives/management', icon: '⚙️', roles: ['admin'] },
        { label: 'Schedule Drive', route: '/admin/drives/schedule', icon: '📅', roles: ['admin'] }
      ]
    },
    {
      label: 'Students',
      route: '/admin/students',
      icon: '👨‍🎓',
      roles: ['admin'],
      children: [
        { label: 'Student List', route: '/admin/students/list', icon: '📋', roles: ['admin'] },
        { label: 'Student Details', route: '/admin/students/details', icon: '👁️', roles: ['admin'] }
      ]
    },
    {
      label: 'Reports',
      route: '/admin/reports',
      icon: '📈',
      roles: ['admin']
    },
    {
      label: 'Settings',
      route: '/admin/settings',
      icon: '⚙️',
      roles: ['admin']
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
    if (!this.currentUser) return [];
    return this.sidebarItems.filter(item =>
      item.roles.includes(this.currentUser!.role)
    );
  }

  toggleItem(item: SidebarItem): void {
    if (item.children && item.children.length > 0) {
      if (this.expandedItems.has(item.route)) {
        this.expandedItems.delete(item.route);
      } else {
        this.expandedItems.add(item.route);
      }
    }
  }

  isItemExpanded(item: SidebarItem): boolean {
    return this.expandedItems.has(item.route);
  }

  hasActiveChild(item: SidebarItem): boolean {
    if (!item.children) return false;
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
    if (!this.currentUser) return '';
    
    const roleMap: Record<User['role'], string> = {
      'student': 'Student',
      'admin': 'Admin',
      'company': 'Company'
    };
    
    return roleMap[this.currentUser.role] || this.currentUser.role;
  }
}