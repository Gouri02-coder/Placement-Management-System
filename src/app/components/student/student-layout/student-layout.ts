import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css'
})
export class StudentLayout {
  isSidebarCollapsed = false;
  studentName = 'John Smith';
  studentEmail = 'john.smith@university.edu';
  studentAvatar = 'JS';

  menuItems = [
    { path: '/student/dashboard', icon: '📊', label: 'Dashboard', active: true },
    { path: '/student/profile', icon: '👤', label: 'My Profile', active: false },
    { path: '/student/jobs', icon: '💼', label: 'Job Portal', active: false },
    { path: '/student/applications', icon: '📝', label: 'My Applications', active: false },
    { path: '/student/interviews', icon: '🎯', label: 'Interviews', active: false },
    { path: '/student/offers', icon: '🎉', label: 'Job Offers', active: false },
    { path: '/student/resume', icon: '📄', label: 'Resume Builder', active: false },
    { path: '/student/settings', icon: '⚙️', label: 'Settings', active: false }
  ];

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  setActiveItem(clickedItem: any): void {
    this.menuItems.forEach(item => {
      item.active = item.path === clickedItem.path;
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully');
      // Navigate to login page
    }
  }
}