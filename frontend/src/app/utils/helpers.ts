import { UserRole } from '../core/models/user.model';
import { APPLICATION_STATUS, JOB_TYPES, INTERVIEW_TYPES, PLACEMENT_STATUS } from './constants';

// Date Helpers
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isDateInFuture = (date: Date | string): boolean => {
  return new Date(date) > new Date();
};

export const getDaysDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// String Helpers
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => capitalizeFirst(txt));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Array Helpers
export const uniqueArray = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Object Helpers
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const isEmptyObject = (obj: any): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const removeNullUndefined = <T>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj as any).filter(([_, v]) => v != null)
  ) as Partial<T>;
};

// Role Helpers
export const getRoleDisplayName = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    [UserRole.STUDENT]: 'Student',
    [UserRole.COMPANY]: 'Company',
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.TPO]: 'Placement Officer'
  };
  return roleMap[role] || role;
};

export const canAccess = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};

// Status Helpers
export const getApplicationStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    [APPLICATION_STATUS.PENDING]: 'warning',
    [APPLICATION_STATUS.SHORTLISTED]: 'info',
    [APPLICATION_STATUS.REJECTED]: 'danger',
    [APPLICATION_STATUS.SELECTED]: 'success',
    [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'primary'
  };
  return statusColors[status] || 'secondary';
};

export const getJobTypeDisplay = (type: string): string => {
  const typeMap: Record<string, string> = {
    [JOB_TYPES.FULL_TIME]: 'Full Time',
    [JOB_TYPES.PART_TIME]: 'Part Time',
    [JOB_TYPES.INTERNSHIP]: 'Internship',
    [JOB_TYPES.CONTRACT]: 'Contract'
  };
  return typeMap[type] || type;
};

export const getInterviewTypeDisplay = (type: string): string => {
  const typeMap: Record<string, string> = {
    [INTERVIEW_TYPES.TECHNICAL]: 'Technical',
    [INTERVIEW_TYPES.HR]: 'HR',
    [INTERVIEW_TYPES.MANAGERIAL]: 'Managerial',
    [INTERVIEW_TYPES.GROUP_DISCUSSION]: 'Group Discussion'
  };
  return typeMap[type] || type;
};

export const getPlacementStatusDisplay = (status: string): string => {
  const statusMap: Record<string, string> = {
    [PLACEMENT_STATUS.NOT_PLACED]: 'Not Placed',
    [PLACEMENT_STATUS.INTERVIEW]: 'Interview',
    [PLACEMENT_STATUS.SELECTED]: 'Selected',
    [PLACEMENT_STATUS.OFFERED]: 'Offer Received',
    [PLACEMENT_STATUS.PLACED]: 'Placed'
  };
  return statusMap[status] || status;
};

// File Helpers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// Number Helpers
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// URL Helpers
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

export const getQueryParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const urlParams = new URLSearchParams(new URL(url).search);
  
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};