import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './modules/shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <!-- Show navbar only on landing page and authenticated routes -->
    <app-navbar *ngIf="showNavbar()"></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  showNavbar(): boolean {
    // Don't show navbar on auth pages
    const currentRoute = window.location.pathname;
    const hideNavbarRoutes = ['/auth/login', '/auth/register', '/login', '/register'];
    return !hideNavbarRoutes.some(route => currentRoute.includes(route));
  }
}