import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit {
  currentYear = new Date().getFullYear();
  backgroundClass = 'default-bg';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect to dashboard if already authenticated
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }

    // Update background based on current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateBackgroundClass(event.urlAfterRedirects);
      });

    // Initial background setup
    this.updateBackgroundClass(this.router.url);
  }

  private updateBackgroundClass(url: string): void {
    if (url.includes('/login')) {
      this.backgroundClass = 'login-bg';
    } else if (url.includes('/register')) {
      this.backgroundClass = 'register-bg';
    } else if (url.includes('/forgot-password')) {
      this.backgroundClass = 'forgot-password-bg';
    } else {
      this.backgroundClass = 'default-bg';
    }
  }

  private redirectToDashboard(): void {
    this.authService.currentUser
      .pipe(take(1))
      .subscribe(user => {
        if (!user) return;

        switch (user.role) {
          case 'student':
            this.router.navigate(['/student/dashboard']);
            break;
          case 'company':
            this.router.navigate(['/company/dashboard']);
            break;
          case 'admin': 
            this.router.navigate(['/placement/dashboard']);
            break;
          default:
            this.router.navigate(['/']);
        }
      });
  }

  getCurrentPageTitle(): string {
    if (this.router.url.includes('/login')) {
      return 'Sign In to Your Account';
    } else if (this.router.url.includes('/register')) {
      return 'Create Your Account';
    } else if (this.router.url.includes('/forgot-password')) {
      return 'Reset Your Password';
    } else {
      return 'Placement Management System';
    }
  }

  getCurrentPageDescription(): string {
    if (this.router.url.includes('/login')) {
      return 'Welcome back! Please sign in to continue.';
    } else if (this.router.url.includes('/register')) {
      return 'Join our platform to connect with amazing opportunities.';
    } else if (this.router.url.includes('/forgot-password')) {
      return 'Enter your email to reset your password.';
    } else {
      return 'Connecting talent with opportunities';
    }
  }
}