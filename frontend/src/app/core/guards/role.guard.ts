import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    // Get roles allowed for this route
    const requiredRoles = route.data['roles'] as string[];
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get current user
    const user = this.authService.currentUserValue;

    if (!user) {
      this.notificationService.error('Access Denied', 'You need to login first.');
      this.router.navigate(['/auth/login']);
      return false;
    }

    console.log('RoleGuard - User role:', user.role);
    console.log('RoleGuard - Required roles:', requiredRoles);

    // Convert both to lowercase for case-insensitive comparison
    const userRoleLower = user.role?.toLowerCase();
    const hasRequiredRole = requiredRoles.some(role => 
      role.toLowerCase() === userRoleLower
    );

    if (!hasRequiredRole) {
      this.notificationService.error(
        'Access Denied',
        'You do not have permission to access this page.'
      );

      // Redirect to appropriate dashboard based on user's role
      this.redirectToDashboard(user.role);
      return false;
    }

    return true;
  }

  private redirectToDashboard(role: string | null): void {
    const roleLower = role?.toLowerCase();
    
    const routes: { [key: string]: string } = {
      'student': '/student/dashboard',
      'pto': '/placement/dashboard', 
      'company': '/company/dashboard',
      'admin': '/admin/dashboard'
    };
    
    const route = roleLower && routes[roleLower] ? routes[roleLower] : '/auth/login';
    this.router.navigate([route]);
  }
}