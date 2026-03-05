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

    // Use the new currentUserValue from AuthService
    const user = this.authService.currentUserValue;

    if (!user || !requiredRoles.includes(user.role)) {
      this.notificationService.error(
        'Access Denied',
        'You do not have permission to access this page.'
      );

      // Redirect to dashboard or login
      this.redirectToDashboard(user ? user.role : null);
      return false;
    }

    return true;
  }

  private redirectToDashboard(role: string | null): void {
    const routes: { [key: string]: string } = {
      'student': '/student/dashboard',
      'placement-officer': '/placement/dashboard', 
      'company': '/company/dashboard',
      'admin': '/admin/dashboard'
    };
    
    const route = role ? routes[role] : '/auth/login';
    this.router.navigate([route]);
  }
}
