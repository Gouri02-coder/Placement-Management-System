import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../../modules/shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../modules/shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../modules/shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../modules/shared/components/loading-spinner/loading-spinner.component';
import { filter } from 'rxjs/operators';
let AdminLayoutComponent = class AdminLayoutComponent {
    authService;
    notificationService;
    router;
    isSidebarCollapsed = false;
    currentRoute = '';
    breadcrumbs = [];
    constructor(authService, notificationService, router) {
        this.authService = authService;
        this.notificationService = notificationService;
        this.router = router;
    }
    ngOnInit() {
        // Verify admin access
        this.verifyAdminAccess();
        // Track current route for breadcrumbs
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event) => {
            this.currentRoute = event.urlAfterRedirects;
            this.generateBreadcrumbs();
        });
        // Initial breadcrumbs
        this.generateBreadcrumbs();
    }
    verifyAdminAccess() {
        const user = this.authService.currentUserValue; // ✅ FIXED
        if (!user || (user.role !== 'admin' && user.role !== 'company')) {
            this.notificationService.error('Access Denied', 'You do not have permission to access the admin area.');
            this.router.navigate(['/']);
        }
    }
    generateBreadcrumbs() {
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
    formatBreadcrumbLabel(segment) {
        // Convert kebab-case to Title Case
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    onToggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
    getAdminRoleDisplay() {
        const user = this.authService.currentUserValue; // ✅ FIXED
        if (!user)
            return 'Administrator';
        return user.role === 'admin' ? 'Placement Officer' : 'Administrator';
    }
    getAdminStats() {
        return [
            { label: 'Total Students', value: '2,847', icon: '🎓' },
            { label: 'Active Companies', value: '156', icon: '🏢' },
            { label: 'Placement Drives', value: '24', icon: '🚀' },
            { label: 'Placement Rate', value: '85%', icon: '📈' }
        ];
    }
};
AdminLayoutComponent = __decorate([
    Component({
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
], AdminLayoutComponent);
export { AdminLayoutComponent };
