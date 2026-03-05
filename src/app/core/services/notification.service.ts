import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ENDPOINTS } from '../../utils/constants';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: string;
  data?: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private nextId = 1;

  // Success notification
  success(title: string, message: string, duration: number = 5000): void {
    this.addNotification({
      id: this.nextId++,
      type: 'success',
      title,
      message,
      duration,
      timestamp: new Date()
    });
  }

  // Error notification
  error(title: string, message: string, duration: number = 7000): void {
    this.addNotification({
      id: this.nextId++,
      type: 'error',
      title,
      message,
      duration,
      timestamp: new Date()
    });
  }

  // Warning notification
  warning(title: string, message: string, duration: number = 5000): void {
    this.addNotification({
      id: this.nextId++,
      type: 'warning',
      title,
      message,
      duration,
      timestamp: new Date()
    });
  }

  // Info notification
  info(title: string, message: string, duration: number = 4000): void {
    this.addNotification({
      id: this.nextId++,
      type: 'info',
      title,
      message,
      duration,
      timestamp: new Date()
    });
  }

  // Add notification
  private addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto remove if duration is set
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  // Remove notification
  removeNotification(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== id
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  // Clear all notifications
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  // Get current notifications
  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  // Get notifications count
  getNotificationCount(): number {
    return this.notificationsSubject.value.length;
  }

  // Get notifications by type
  getNotificationsByType(type: string): Notification[] {
    return this.notificationsSubject.value.filter(
      notification => notification.type === type
    );
  }

  // Clear notifications by type
  clearByType(type: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.type !== type
    );
    this.notificationsSubject.next(updatedNotifications);
  }
}