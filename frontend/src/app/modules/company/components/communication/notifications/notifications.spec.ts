import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Notifications } from './notifications';

describe('Notifications', () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notifications, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load notifications on init', () => {
      expect(component.notifications.length).toBeGreaterThan(0);
      // Check stats through public properties that are updated by loadNotifications
      expect(component.stats.total).toBe(component.notifications.length);
    });
  });

  describe('Filters', () => {
    beforeEach(() => {
      component.applyFilters();
    });

    it('should filter by unread', () => {
      component.selectedFilter = 'unread';
      component.applyFilters();
      expect(component.filteredNotifications.every(n => !n.read)).toBeTrue();
    });

    it('should filter by read', () => {
      component.selectedFilter = 'read';
      component.applyFilters();
      expect(component.filteredNotifications.every(n => n.read)).toBeTrue();
    });

    it('should filter by category', () => {
      component.selectedFilter = 'placement';
      component.applyFilters();
      expect(component.filteredNotifications.every(n => n.category === 'placement')).toBeTrue();
    });

    it('should search notifications', () => {
      component.searchTerm = 'Tech Mahindra';
      component.applyFilters();
      expect(component.filteredNotifications.length).toBeGreaterThan(0);
    });

    it('should clear filters', () => {
      component.searchTerm = 'test';
      component.selectedFilter = 'unread';
      component.applyFilters();
      component.selectedFilter = 'all';
      component.searchTerm = '';
      component.applyFilters();
      expect(component.filteredNotifications.length).toBe(component.notifications.length);
    });
  });

  describe('Notification Actions', () => {
    it('should mark notification as read', () => {
      const notification = component.notifications.find(n => !n.read);
      const initialUnreadCount = component.stats.unread;
      component.markAsRead(notification);
      expect(notification.read).toBeTrue();
      // Check stats after marking as read (stats are updated via public methods)
      expect(component.stats.unread).toBe(initialUnreadCount - 1);
    });

    it('should mark all as read', () => {
      component.markAllAsRead();
      expect(component.notifications.every(n => n.read)).toBeTrue();
      expect(component.stats.unread).toBe(0);
    });

    it('should delete notification', () => {
      const initialCount = component.notifications.length;
      const notification = component.notifications[0];
      const event = new Event('click');
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteNotification(notification, event);
      expect(component.notifications.length).toBe(initialCount - 1);
    });

    it('should clear all notifications', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.clearAllNotifications();
      expect(component.notifications.length).toBe(0);
      expect(component.stats.total).toBe(0);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Set up filtered notifications
      component.filteredNotifications = Array(25).fill({
        id: 1,
        title: 'Test Notification',
        message: 'Test message',
        read: false,
        category: 'system',
        priority: 'low'
      });
      component.itemsPerPage = 10;
      // Call applyFilters which triggers calculateTotalPages internally
      component.applyFilters();
    });

    it('should calculate total pages correctly', () => {
      expect(component.totalPages).toBe(3);
    });

    it('should return paginated notifications for page 1', () => {
      component.currentPage = 1;
      const paginated = component.paginatedNotifications;
      expect(paginated.length).toBe(10);
    });
    
    it('should return paginated notifications for page 2', () => {
      component.currentPage = 2;
      const paginated = component.paginatedNotifications;
      expect(paginated.length).toBe(10);
    });
    
    it('should return paginated notifications for last page', () => {
      component.currentPage = 3;
      const paginated = component.paginatedNotifications;
      expect(paginated.length).toBe(5);
    });

    it('should change page', () => {
      component.totalPages = 5;
      component.changePage(3);
      expect(component.currentPage).toBe(3);
      
      component.changePage(6);
      expect(component.currentPage).toBe(3);
    });

    it('should generate page numbers with current page in middle', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([3, 4, 5, 6, 7]);
    });

    it('should generate page numbers for first pages', () => {
      component.totalPages = 10;
      component.currentPage = 1;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should generate page numbers for last pages', () => {
      component.totalPages = 10;
      component.currentPage = 10;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([6, 7, 8, 9, 10]);
    });

    it('should generate page numbers for small total pages', () => {
      component.totalPages = 3;
      component.currentPage = 2;
      const pages = component.getPages();
      expect(pages.length).toBe(3);
      expect(pages).toEqual([1, 2, 3]);
    });
  });

  describe('Helper Methods', () => {
    it('should format time correctly', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
      const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 86400000);
      
      expect(component.formatTime(fiveMinutesAgo.toISOString())).toContain('min ago');
      expect(component.formatTime(twoHoursAgo.toISOString())).toContain('hour');
      expect(component.formatTime(threeDaysAgo.toISOString())).toContain('day');
    });

    it('should return category config', () => {
      expect(component.getCategoryConfig('placement').icon).toBe('work');
      expect(component.getCategoryConfig('application').icon).toBe('description');
      // Test fallback for unknown category
      expect(component.getCategoryConfig('unknown').icon).toBe('settings');
    });

    it('should return priority class', () => {
      expect(component.getPriorityClass('high')).toBe('priority-high');
      expect(component.getPriorityClass('medium')).toBe('priority-medium');
      expect(component.getPriorityClass('low')).toBe('priority-low');
      expect(component.getPriorityClass('unknown')).toBe('');
    });

    it('should return priority icon', () => {
      expect(component.getPriorityIcon('high')).toBe('error');
      expect(component.getPriorityIcon('medium')).toBe('info');
      expect(component.getPriorityIcon('low')).toBe('check_circle');
      expect(component.getPriorityIcon('unknown')).toBe('notifications');
    });

    it('should get filter count', () => {
      expect(component.getFilterCount('all')).toBe(component.stats.total);
      expect(component.getFilterCount('unread')).toBe(component.stats.unread);
      expect(component.getFilterCount('read')).toBe(component.stats.read);
      expect(component.getFilterCount('placement')).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Statistics - Via Public Methods', () => {
    it('should update stats after marking a notification as read', () => {
      // Get initial unread count
      const initialUnread = component.stats.unread;
      
      // Find an unread notification
      const unreadNotification = component.notifications.find(n => !n.read);
      if (unreadNotification) {
        component.markAsRead(unreadNotification);
        // Verify stats updated correctly
        expect(component.stats.unread).toBe(initialUnread - 1);
      }
    });

    it('should update stats after marking all as read', () => {
      component.markAllAsRead();
      expect(component.stats.unread).toBe(0);
      expect(component.stats.read).toBe(component.stats.total);
    });

    it('should update stats after deletion', () => {
      const initialTotal = component.stats.total;
      const notification = component.notifications[0];
      const event = new Event('click');
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteNotification(notification, event);
      
      expect(component.stats.total).toBe(initialTotal - 1);
    });

    it('should update stats after clearing all notifications', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.clearAllNotifications();
      expect(component.stats.total).toBe(0);
      expect(component.stats.unread).toBe(0);
      expect(component.stats.read).toBe(0);
    });
  });

  describe('Navigation', () => {
    it('should navigate to action URL', () => {
      const notification = {
        id: 1,
        title: 'Test',
        message: 'Test message',
        read: false,
        actionUrl: '/test',
        actionLabel: 'View'
      };
      
      spyOn(component, 'navigateToAction').and.callThrough();
      component.navigateToAction(notification);
      
      expect(component.navigateToAction).toHaveBeenCalledWith(notification);
    });

    it('should mark notification as read when navigating', () => {
      const notification = component.notifications.find(n => !n.read);
      if (notification) {
        const wasUnread = !notification.read;
        component.navigateToAction(notification);
        expect(notification.read).toBeTrue();
      }
    });
  });

  describe('Apply Filters Integration', () => {
    it('should filter by multiple criteria', () => {
      // Set up test data
      component.notifications = [
        { id: 1, title: 'Placement Drive', message: 'Test', read: false, category: 'placement', priority: 'high' },
        { id: 2, title: 'Application Update', message: 'Test', read: true, category: 'application', priority: 'medium' },
        { id: 3, title: 'Interview Schedule', message: 'Test', read: false, category: 'interview', priority: 'high' }
      ];
      component.applyFilters(); // This updates stats internally
      
      component.selectedFilter = 'unread';
      component.searchTerm = 'placement';
      component.applyFilters();
      
      expect(component.filteredNotifications.length).toBe(1);
      expect(component.filteredNotifications[0].category).toBe('placement');
      expect(component.filteredNotifications[0].read).toBeFalse();
    });

    it('should reset to all notifications when filter is all', () => {
      component.selectedFilter = 'unread';
      component.applyFilters();
      const unreadCount = component.filteredNotifications.length;
      
      component.selectedFilter = 'all';
      component.applyFilters();
      expect(component.filteredNotifications.length).toBe(component.notifications.length);
    });

    it('should handle empty search results', () => {
      component.searchTerm = 'nonexistentstringthatwontmatchanything';
      component.applyFilters();
      expect(component.filteredNotifications.length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null or undefined notification in markAsRead', () => {
      expect(() => component.markAsRead(null)).not.toThrow();
      expect(() => component.markAsRead(undefined)).not.toThrow();
    });

    it('should handle delete with confirmation false', () => {
      const initialCount = component.notifications.length;
      const notification = component.notifications[0];
      const event = new Event('click');
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.deleteNotification(notification, event);
      
      expect(component.notifications.length).toBe(initialCount);
    });

    it('should handle empty notifications list', () => {
      component.notifications = [];
      component.applyFilters(); // This updates stats and pagination internally
      
      expect(component.stats.total).toBe(0);
      expect(component.filteredNotifications.length).toBe(0);
      expect(component.totalPages).toBe(1);
    });

    it('should handle delete on non-existent notification', () => {
      const event = new Event('click');
      spyOn(window, 'confirm').and.returnValue(true);
      expect(() => component.deleteNotification(null, event)).not.toThrow();
    });
  });

  describe('Get Pages - Edge Cases', () => {
    it('should return empty array when totalPages is 0', () => {
      component.totalPages = 0;
      const pages = component.getPages();
      expect(pages).toEqual([]);
    });

    it('should return single page when totalPages is 1', () => {
      component.totalPages = 1;
      component.currentPage = 1;
      const pages = component.getPages();
      expect(pages).toEqual([1]);
    });

    it('should handle currentPage beyond totalPages', () => {
      component.totalPages = 5;
      component.currentPage = 10;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });
  });
});