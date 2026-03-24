import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
let NotificationService = class NotificationService {
    notificationsSubject = new BehaviorSubject([]);
    notifications$ = this.notificationsSubject.asObservable();
    nextId = 1;
    // Success notification
    success(title, message, duration = 5000) {
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
    error(title, message, duration = 7000) {
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
    warning(title, message, duration = 5000) {
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
    info(title, message, duration = 4000) {
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
    addNotification(notification) {
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
    removeNotification(id) {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(notification => notification.id !== id);
        this.notificationsSubject.next(updatedNotifications);
    }
    // Clear all notifications
    clearAll() {
        this.notificationsSubject.next([]);
    }
    // Get current notifications
    getNotifications() {
        return this.notificationsSubject.value;
    }
    // Get notifications count
    getNotificationCount() {
        return this.notificationsSubject.value.length;
    }
    // Get notifications by type
    getNotificationsByType(type) {
        return this.notificationsSubject.value.filter(notification => notification.type === type);
    }
    // Clear notifications by type
    clearByType(type) {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(notification => notification.type !== type);
        this.notificationsSubject.next(updatedNotifications);
    }
};
NotificationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NotificationService);
export { NotificationService };
