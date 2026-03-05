import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../../modules/shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../modules/shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../modules/shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../modules/shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  showSidebar = false;
  currentRoute = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Track current route to determine layout
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateLayoutBasedOnRoute();
      });

    // Initial layout setup
    this.updateLayoutBasedOnRoute();
  }

  private updateLayoutBasedOnRoute(): void {
    const user = this.authService.currentUser;
    
    if (!user) {
      this.showSidebar = false;
      return;
    }

    // Show sidebar for student, company, and admin routes
    this.showSidebar = 
      this.currentRoute.startsWith('/student') ||
      this.currentRoute.startsWith('/company') ||
      this.currentRoute.startsWith('/admin');
  }

  onToggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  getContainerClass(): string {
    if (!this.showSidebar) {
      return 'layout-container no-sidebar';
    }
    
    return this.isSidebarCollapsed 
      ? 'layout-container sidebar-collapsed' 
      : 'layout-container sidebar-expanded';
  }

  getMainContentClass(): string {
    if (!this.showSidebar) {
      return 'main-content full-width';
    }
    
    return this.isSidebarCollapsed 
      ? 'main-content sidebar-collapsed' 
      : 'main-content sidebar-expanded';
  }

  shouldShowFooter(): boolean {
    // Don't show footer on auth pages and some admin pages
    const noFooterRoutes = [
      '/auth',
      '/admin/settings',
      '/student/profile',
      '/company/profile'
    ];
    
    return !noFooterRoutes.some(route => this.currentRoute.startsWith(route));
  }
}