<<<<<<< HEAD
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
=======
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentDashboard } from './components/student/student-dashboard/student-dashboard';
import { StudentDetails } from './components/student/student-details/student-details';
import { StudentList } from './components/student/student-list/student-list';
import { StudentForm } from './components/student/student-form/student-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,StudentDashboard,StudentDetails,StudentList,StudentForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
>>>>>>> 53b036966c30718bb2f8410656ebe2d0f4e00ad4
