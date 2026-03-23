import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  notifications: any[] = [];
  filteredNotifications: any[] = [];
  isLoading = true;
  
  // Filter properties
  selectedFilter = 'all';
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Statistics
  stats = {
    total: 0,
    unread: 0,
    read: 0
  };
  
  // Filter options
  filterOptions = [
    { value: 'all', label: 'All Notifications', icon: 'notifications' },
    { value: 'unread', label: 'Unread', icon: 'mark_email_unread' },
    { value: 'read', label: 'Read', icon: 'mark_email_read' },
    { value: 'placement', label: 'Placement Drives', icon: 'work' },
    { value: 'application', label: 'Applications', icon: 'description' },
    { value: 'interview', label: 'Interviews', icon: 'interview' },
    { value: 'result', label: 'Results', icon: 'assessment' }
  ];
  
  // Notification categories with icons and colors
categoryConfig: { 
  [key: string]: { icon: string; color: string; bgColor: string; }
} = {
  placement: { icon: 'work', color: '#3b82f6', bgColor: '#eff6ff' },
  application: { icon: 'description', color: '#8b5cf6', bgColor: '#f5f3ff' },
  interview: { icon: 'record_voice_over', color: '#f59e0b', bgColor: '#fffbeb' },
  result: { icon: 'assessment', color: '#10b981', bgColor: '#f0fdf4' },
  reminder: { icon: 'schedule', color: '#ef4444', bgColor: '#fef2f2' },
  system: { icon: 'settings', color: '#6b7280', bgColor: '#f9fafb' },
  message: { icon: 'chat', color: '#ec489a', bgColor: '#fdf2f8' },
  alert: { icon: 'warning', color: '#f97316', bgColor: '#fff7ed' }
};
  constructor() {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    // Simulate API call - replace with actual service
    setTimeout(() => {
      this.notifications = [
        {
          id: 1,
          title: 'Tech Mahindra Campus Drive',
          message: 'Your application for Software Developer position has been shortlisted. Interview scheduled for April 5th, 2024 at 10:00 AM.',
          type: 'placement',
          category: 'placement',
          timestamp: '2024-03-22T09:30:00',
          read: false,
          actionUrl: '/drives/1',
          actionLabel: 'View Details',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Resume Update Required',
          message: 'Please update your resume before March 25th to be eligible for upcoming drives.',
          type: 'reminder',
          category: 'reminder',
          timestamp: '2024-03-21T14:15:00',
          read: false,
          actionUrl: '/profile',
          actionLabel: 'Update Resume',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Infosys Virtual Drive Registration',
          message: 'Registration for Infosys Virtual Drive is now open. Last date to register is April 10th, 2024.',
          type: 'placement',
          category: 'placement',
          timestamp: '2024-03-21T10:00:00',
          read: true,
          actionUrl: '/drives/2',
          actionLabel: 'Register Now',
          priority: 'high'
        },
        {
          id: 4,
          title: 'Interview Feedback Received',
          message: 'Your interview feedback for Amazon Off-Campus Drive is now available. Check your dashboard for details.',
          type: 'result',
          category: 'result',
          timestamp: '2024-03-20T16:45:00',
          read: true,
          actionUrl: '/applications',
          actionLabel: 'View Feedback',
          priority: 'high'
        },
        {
          id: 5,
          title: 'New Message from Placement Officer',
          message: 'Dr. Sarah Johnson has sent you a message regarding your application status.',
          type: 'message',
          category: 'message',
          timestamp: '2024-03-20T11:20:00',
          read: false,
          actionUrl: '/messages',
          actionLabel: 'View Message',
          priority: 'medium'
        },
        {
          id: 6,
          title: 'Document Verification',
          message: 'Please upload your academic documents for verification. This is required for the final selection process.',
          type: 'reminder',
          category: 'reminder',
          timestamp: '2024-03-19T09:00:00',
          read: true,
          actionUrl: '/documents',
          actionLabel: 'Upload Documents',
          priority: 'medium'
        },
        {
          id: 7,
          title: 'TCS NQT Results Announced',
          message: 'Results for TCS National Qualifier Test are now available. Congratulations to all selected candidates!',
          type: 'result',
          category: 'result',
          timestamp: '2024-03-18T15:30:00',
          read: true,
          actionUrl: '/results',
          actionLabel: 'View Results',
          priority: 'high'
        },
        {
          id: 8,
          title: 'Upcoming Webinar: Resume Building',
          message: 'Join our webinar on "How to Build an Impressive Resume" on March 25th at 3:00 PM.',
          type: 'system',
          category: 'system',
          timestamp: '2024-03-18T10:00:00',
          read: false,
          actionUrl: '/events',
          actionLabel: 'Register',
          priority: 'low'
        },
        {
          id: 9,
          title: 'Application Status Update',
          message: 'Your application for the Software Development Intern position has been reviewed and you have been shortlisted for the next round.',
          type: 'application',
          category: 'application',
          timestamp: '2024-03-17T14:20:00',
          read: true,
          actionUrl: '/applications',
          actionLabel: 'View Application',
          priority: 'high'
        },
        {
          id: 10,
          title: 'New Placement Drive: Google',
          message: 'Google is conducting a virtual drive for Software Engineer positions. Eligibility: CGPA 8.5+, 2024 batch.',
          type: 'placement',
          category: 'placement',
          timestamp: '2024-03-16T11:00:00',
          read: true,
          actionUrl: '/drives/5',
          actionLabel: 'Learn More',
          priority: 'high'
        },
        {
          id: 11,
          title: 'Interview Preparation Tips',
          message: 'Check out our new resources for interview preparation including mock tests and practice questions.',
          type: 'system',
          category: 'system',
          timestamp: '2024-03-15T09:00:00',
          read: true,
          actionUrl: '/resources',
          actionLabel: 'Explore',
          priority: 'low'
        },
        {
          id: 12,
          title: 'Deadline Approaching',
          message: 'Registration for Tech Mahindra drive closes in 2 days. Complete your application soon!',
          type: 'reminder',
          category: 'reminder',
          timestamp: '2024-03-14T16:00:00',
          read: true,
          actionUrl: '/drives/1',
          actionLabel: 'Apply Now',
          priority: 'high'
        }
      ];
      
      this.updateStats();
      this.applyFilters();
      this.isLoading = false;
    }, 1000);
  }

  private updateStats(): void {
    this.stats.total = this.notifications.length;
    this.stats.unread = this.notifications.filter(n => !n.read).length;
    this.stats.read = this.stats.total - this.stats.unread;
  }

  applyFilters(): void {
    this.filteredNotifications = this.notifications.filter(notification => {
      // Filter by type/category
      let matchesFilter = true;
      if (this.selectedFilter !== 'all') {
        if (this.selectedFilter === 'unread') {
          matchesFilter = !notification.read;
        } else if (this.selectedFilter === 'read') {
          matchesFilter = notification.read;
        } else {
          matchesFilter = notification.category === this.selectedFilter;
        }
      }
      
      // Filter by search term
      const matchesSearch = this.searchTerm === '' || 
        notification.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
    
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredNotifications.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  get paginatedNotifications(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredNotifications.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  markAsRead(notification: any): void {
    if (!notification.read) {
      notification.read = true;
      this.updateStats();
      this.applyFilters();
      
      // Simulate API call to mark as read
      console.log('Marked as read:', notification.id);
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateStats();
    this.applyFilters();
    
    alert('All notifications marked as read');
  }

  deleteNotification(notification: any, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this notification?')) {
      const index = this.notifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
        this.updateStats();
        this.applyFilters();
      }
    }
  }

  clearAllNotifications(): void {
    if (confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      this.notifications = [];
      this.updateStats();
      this.applyFilters();
    }
  }

getCategoryConfig(category: string): { icon: string; color: string; bgColor: string } {

  return this.categoryConfig[category] || this.categoryConfig['system'];
}

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'info';
      case 'low': return 'check_circle';
      default: return 'notifications';
    }
  }

  navigateToAction(notification: any): void {
    this.markAsRead(notification);
    if (notification.actionUrl) {
      // Navigate using router
      console.log('Navigate to:', notification.actionUrl);
      // this.router.navigate([notification.actionUrl]);
    }
  }

  getFilterCount(filterValue: string): number {
    if (filterValue === 'all') return this.stats.total;
    if (filterValue === 'unread') return this.stats.unread;
    if (filterValue === 'read') return this.stats.read;
    return this.notifications.filter(n => n.category === filterValue).length;
  }
}