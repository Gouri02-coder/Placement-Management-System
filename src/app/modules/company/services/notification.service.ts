import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number; // Auto-dismiss after milliseconds (0 = never auto-dismiss)
  dismissible?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
  icon?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private nextId = 1;

  notifications$: Observable<Notification[]> = this.notifications.asObservable();

  /**
   * Show success notification
   */
  showSuccess(message: string, title?: string, duration: number = 5000): number {
    return this.addNotification({
      type: 'success',
      title: title || 'Success',
      message,
      duration,
      dismissible: true,
      icon: '✓'
    });
  }

  /**
   * Show error notification
   */
  showError(message: string, title?: string, duration: number = 8000): number {
    return this.addNotification({
      type: 'error',
      title: title || 'Error',
      message,
      duration,
      dismissible: true,
      icon: '✗'
    });
  }

  /**
   * Show info notification
   */
  showInfo(message: string, title?: string, duration: number = 4000): number {
    return this.addNotification({
      type: 'info',
      title: title || 'Information',
      message,
      duration,
      dismissible: true,
      icon: 'ℹ'
    });
  }

  /**
   * Show warning notification
   */
  showWarning(message: string, title?: string, duration: number = 6000): number {
    return this.addNotification({
      type: 'warning',
      title: title || 'Warning',
      message,
      duration,
      dismissible: true,
      icon: '⚠'
    });
  }

  /**
   * Show custom notification
   */
  showNotification(notification: Partial<Notification>): number {
    return this.addNotification({
      type: 'info',
      message: '',
      dismissible: true,
      duration: 4000,
      ...notification
    });
  }

  /**
   * Show confirmation dialog
   */
  showConfirm(
    message: string, 
    title: string = 'Confirm Action',
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const notificationId = this.addNotification({
        type: 'warning',
        title,
        message,
        duration: 0, // Never auto-dismiss
        dismissible: false,
        action: {
          label: confirmText,
          callback: () => {
            this.removeNotification(notificationId);
            resolve(true);
          }
        }
      });

      // Add cancel action
      const currentNotifications = this.notifications.value;
      const notification = currentNotifications.find(n => n.id === notificationId);
      
      if (notification) {
        notification.action = {
          ...notification.action!,
          label: `${cancelText} | ${confirmText}`,
          callback: () => {
            this.removeNotification(notificationId);
            resolve(true);
          }
        };

        // Add separate cancel button through data
        notification.data = {
          cancelCallback: () => {
            this.removeNotification(notificationId);
            resolve(false);
          },
          cancelText
        };

        this.notifications.next([...currentNotifications]);
      }
    });
  }

  /**
   * Show loading notification
   */
  showLoading(message: string, title?: string): number {
    return this.addNotification({
      type: 'info',
      title: title || 'Loading',
      message,
      duration: 0,
      dismissible: false,
      icon: '⏳'
    });
  }

  /**
   * Update loading notification
   */
  updateLoading(id: number, message: string, type?: Notification['type']): void {
    const notifications = this.notifications.value;
    const index = notifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      notifications[index] = {
        ...notifications[index],
        message,
        type: type || notifications[index].type
      };
      
      this.notifications.next([...notifications]);
    }
  }

  /**
   * Show notification with action button
   */
  showAction(
    message: string,
    actionLabel: string,
    actionCallback: () => void,
    title?: string,
    duration: number = 8000
  ): number {
    return this.addNotification({
      type: 'info',
      title: title || 'Action Required',
      message,
      duration,
      dismissible: true,
      action: {
        label: actionLabel,
        callback: actionCallback
      }
    });
  }

  /**
   * Show notification with template
   */
  showTemplate(template: TemplateRef<any>, data?: any, duration?: number): number {
    const notificationId = this.nextId++;
    
    const notifications = this.notifications.value;
    notifications.push({
      id: notificationId,
      type: 'info',
      message: '',
      duration,
      dismissible: true,
      data: {
        template,
        ...data
      }
    });
    
    this.notifications.next([...notifications]);
    return notificationId;
  }

  /**
   * Remove notification by ID
   */
  removeNotification(id: number): void {
    const notifications = this.notifications.value.filter(n => n.id !== id);
    this.notifications.next([...notifications]);
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.next([]);
  }

  /**
   * Clear notifications by type
   */
  clearByType(type: Notification['type']): void {
    const notifications = this.notifications.value.filter(n => n.type !== type);
    this.notifications.next([...notifications]);
  }

  /**
   * Get current notifications
   */
  getNotifications(): Notification[] {
    return this.notifications.value;
  }

  /**
   * Check if any notifications exist
   */
  hasNotifications(): boolean {
    return this.notifications.value.length > 0;
  }

  /**
   * Get notification count
   */
  getNotificationCount(): number {
    return this.notifications.value.length;
  }

  /**
   * Get notification count by type
   */
  getNotificationCountByType(type: Notification['type']): number {
    return this.notifications.value.filter(n => n.type === type).length;
  }

  /**
   * Format error message
   */
  formatErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.statusText) {
      return error.statusText;
    }
    
    return 'An unknown error occurred';
  }

  /**
   * Show API error notification
   */
  showApiError(error: any, defaultMessage: string = 'Operation failed'): number {
    const message = this.formatErrorMessage(error);
    return this.showError(message || defaultMessage);
  }

  /**
   * Show success for CRUD operations
   */
  showCrudSuccess(operation: 'created' | 'updated' | 'deleted', itemName: string): number {
    const messages = {
      created: `Successfully created ${itemName}`,
      updated: `Successfully updated ${itemName}`,
      deleted: `Successfully deleted ${itemName}`
    };
    
    return this.showSuccess(messages[operation]);
  }

  /**
   * Show network error
   */
  showNetworkError(): number {
    return this.showError(
      'Unable to connect to the server. Please check your internet connection and try again.',
      'Network Error'
    );
  }

  /**
   * Show validation errors
   */
  showValidationErrors(errors: string[]): number {
    const message = errors.length === 1 
      ? errors[0]
      : `Please fix the following errors:<br>• ${errors.join('<br>• ')}`;
    
    return this.showError(message, 'Validation Error', 10000);
  }

  /**
   * Private helper method to add notification
   */
  private addNotification(notification: Omit<Notification, 'id'>): number {
    const notificationId = this.nextId++;
    
    const newNotification: Notification = {
      id: notificationId,
      ...notification
    };

    const notifications = this.notifications.value;
    notifications.push(newNotification);
    
    this.notifications.next([...notifications]);

    // Auto-remove if duration is set
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notificationId);
      }, notification.duration);
    }

    return notificationId;
  }
}