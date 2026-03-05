import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isLoggedIn(): boolean {
    // Add your actual authentication logic here
    return false; // Change based on auth status
  }

  logout(): void {
    // Add logout logic here
    this.router.navigate(['/']);
  }
}