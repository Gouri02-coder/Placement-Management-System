import { formatCurrency, formatNumber, formatDate, formatDateTime } from './helpers';
import { JOB_TYPES, APPLICATION_STATUS, PLACEMENT_STATUS } from './constants';

// Job Formatters
export const formatSalary = (min: number, max: number, currency: string = 'INR'): string => {
  if (min === max) {
    return formatCurrency(min, currency);
  }
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
};

export const formatJobType = (type: string): string => {
  const typeMap: Record<string, string> = {
    [JOB_TYPES.FULL_TIME]: 'Full Time',
    [JOB_TYPES.PART_TIME]: 'Part Time',
    [JOB_TYPES.INTERNSHIP]: 'Internship',
    [JOB_TYPES.CONTRACT]: 'Contract'
  };
  return typeMap[type] || type;
};

export const formatExperience = (min: number, max: number): string => {
  if (min === 0 && max === 0) return 'Fresher';
  if (min === max) return `${min} year${min > 1 ? 's' : ''}`;
  return `${min} - ${max} years`;
};

// Application Formatters
export const formatApplicationStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    [APPLICATION_STATUS.PENDING]: 'Pending',
    [APPLICATION_STATUS.SHORTLISTED]: 'Shortlisted',
    [APPLICATION_STATUS.REJECTED]: 'Rejected',
    [APPLICATION_STATUS.SELECTED]: 'Selected',
    [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'Interview Scheduled'
  };
  return statusMap[status] || status;
};

export const getApplicationStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    [APPLICATION_STATUS.PENDING]: 'badge-warning',
    [APPLICATION_STATUS.SHORTLISTED]: 'badge-info',
    [APPLICATION_STATUS.REJECTED]: 'badge-danger',
    [APPLICATION_STATUS.SELECTED]: 'badge-success',
    [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'badge-primary'
  };
  return classMap[status] || 'badge-secondary';
};

// Placement Formatters
export const formatPlacementStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    [PLACEMENT_STATUS.NOT_PLACED]: 'Not Placed',
    [PLACEMENT_STATUS.INTERVIEW]: 'In Interview',
    [PLACEMENT_STATUS.SELECTED]: 'Selected',
    [PLACEMENT_STATUS.OFFERED]: 'Offer Received',
    [PLACEMENT_STATUS.PLACED]: 'Placed'
  };
  return statusMap[status] || status;
};

// Number Formatters
export const formatCGPA = (cgpa: number): string => {
  return cgpa.toFixed(2);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};

// Date Formatters for Display
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

export const formatDeadline = (date: Date | string): string => {
  const target = new Date(date);
  const now = new Date();
  const diffInDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) return 'Expired';
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays <= 7) return `In ${diffInDays} days`;
  
  return formatDate(date);
};

// File Formatters
export const formatResumeName = (filename: string): string => {
  if (!filename) return 'No resume uploaded';
  
  // Remove file extension and format
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  return `Resume - ${nameWithoutExt}`;
};

// Text Formatters
export const formatSkills = (skills: string[]): string => {
  if (!skills || skills.length === 0) return 'No skills specified';
  return skills.join(', ');
};

export const formatAddress = (address: any): string => {
  if (!address) return 'Address not specified';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
};

// Export all formatters
export const Formatters = {
  // Job related
  salary: formatSalary,
  jobType: formatJobType,
  experience: formatExperience,
  
  // Application related
  applicationStatus: formatApplicationStatus,
  applicationStatusBadge: getApplicationStatusBadgeClass,
  
  // Placement related
  placementStatus: formatPlacementStatus,
  
  // Number related
  cgpa: formatCGPA,
  percentage: formatPercentage,
  currency: formatCurrency,
  number: formatNumber,
  
  // Date related
  date: formatDate,
  dateTime: formatDateTime,
  relativeTime: formatRelativeTime,
  deadline: formatDeadline,
  
  // File related
  resumeName: formatResumeName,
  
  // Text related
  skills: formatSkills,
  address: formatAddress
};

export default Formatters;