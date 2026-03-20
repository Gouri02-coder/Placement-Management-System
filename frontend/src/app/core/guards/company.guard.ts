import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.currentUserValue; // Assuming currentUserValue is a synchronous getter
    if (user?.role === 'company') {
      return true;
    }
    
    this.router.navigate(['/auth/login']);
    return false;
  }
}