export interface Notification {
  id: string;
  companyId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'application' | 'job' | 'drive' | 'system' | 'profile';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface BulkNotification {
  title: string;
  message: string;
  recipientIds: string[];
  type: 'email' | 'sms' | 'inApp';
}