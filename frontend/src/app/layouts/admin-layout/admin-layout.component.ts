import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../../modules/shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../modules/shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../modules/shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../modules/shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  currentRoute = '';
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verify admin access
    this.verifyAdminAccess();

    // Track current route for breadcrumbs
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
        this.generateBreadcrumbs();
      });

    // Initial breadcrumbs
    this.generateBreadcrumbs();
  }

  private verifyAdminAccess(): void {
    const user = this.authService.currentUserValue; // ✅ FIXED

    if (!user || (user.role !== 'admin' && user.role !== 'company')) {
      this.notificationService.error(
        'Access Denied',
        'You do not have permission to access the admin area.'
      );
      this.router.navigate(['/']);
    }
  }

  private generateBreadcrumbs(): void {
    this.breadcrumbs = [];
    
    // Add Home breadcrumb
    this.breadcrumbs.push({ label: 'Dashboard', url: '/admin/dashboard' });

    // Parse route and add additional breadcrumbs
    const segments = this.currentRoute.split('/').filter(segment => segment);
    
    if (segments.length > 2) { // Skip 'admin' segment
      let accumulatedUrl = '';
      
      for (let i = 2; i < segments.length; i++) {
        const segment = segments[i];
        accumulatedUrl += `/${segment}`;
        
        const label = this.formatBreadcrumbLabel(segment);
        this.breadcrumbs.push({
          label: label,
          url: `/admin${accumulatedUrl}`
        });
      }
    }
  }

  private formatBreadcrumbLabel(segment: string): string {
    // Convert kebab-case to Title Case
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onToggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  getAdminRoleDisplay(): string {
    const user = this.authService.currentUserValue; // ✅ FIXED
    if (!user) return 'Administrator';
    
    return user.role === 'admin' ? 'Placement Officer' : 'Administrator';
  }

  getAdminStats(): { label: string; value: string; icon: string }[] {
    return [
      { label: 'Total Students', value: '2,847', icon: '🎓' },
      { label: 'Active Companies', value: '156', icon: '🏢' },
      { label: 'Placement Drives', value: '24', icon: '🚀' },
      { label: 'Placement Rate', value: '85%', icon: '📈' }
    ];
  }
}
