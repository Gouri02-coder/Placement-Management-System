import { UserRole } from '../core/models/user.model';
import { APPLICATION_STATUS, JOB_TYPES, INTERVIEW_TYPES, PLACEMENT_STATUS } from './constants';
// Date Helpers
export const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
export const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
export const isDateInFuture = (date) => {
    return new Date(date) > new Date();
};
export const getDaysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
// String Helpers
export const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export const capitalizeWords = (str) => {
    return str.replace(/\w\S*/g, (txt) => capitalizeFirst(txt));
};
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
};
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
// Array Helpers
export const uniqueArray = (array) => {
    return [...new Set(array)];
};
export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = String(item[key]);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};
export const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal)
            return order === 'asc' ? -1 : 1;
        if (aVal > bVal)
            return order === 'asc' ? 1 : -1;
        return 0;
    });
};
// Object Helpers
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};
export const removeNullUndefined = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};
// Role Helpers
export const getRoleDisplayName = (role) => {
    const roleMap = {
        [UserRole.STUDENT]: 'Student',
        [UserRole.COMPANY]: 'Company',
        [UserRole.ADMIN]: 'Administrator',
        [UserRole.TPO]: 'Placement Officer'
    };
    return roleMap[role] || role;
};
export const canAccess = (userRole, allowedRoles) => {
    return allowedRoles.includes(userRole);
};
// Status Helpers
export const getApplicationStatusColor = (status) => {
    const statusColors = {
        [APPLICATION_STATUS.PENDING]: 'warning',
        [APPLICATION_STATUS.SHORTLISTED]: 'info',
        [APPLICATION_STATUS.REJECTED]: 'danger',
        [APPLICATION_STATUS.SELECTED]: 'success',
        [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'primary'
    };
    return statusColors[status] || 'secondary';
};
export const getJobTypeDisplay = (type) => {
    const typeMap = {
        [JOB_TYPES.FULL_TIME]: 'Full Time',
        [JOB_TYPES.PART_TIME]: 'Part Time',
        [JOB_TYPES.INTERNSHIP]: 'Internship',
        [JOB_TYPES.CONTRACT]: 'Contract'
    };
    return typeMap[type] || type;
};
export const getInterviewTypeDisplay = (type) => {
    const typeMap = {
        [INTERVIEW_TYPES.TECHNICAL]: 'Technical',
        [INTERVIEW_TYPES.HR]: 'HR',
        [INTERVIEW_TYPES.MANAGERIAL]: 'Managerial',
        [INTERVIEW_TYPES.GROUP_DISCUSSION]: 'Group Discussion'
    };
    return typeMap[type] || type;
};
export const getPlacementStatusDisplay = (status) => {
    const statusMap = {
        [PLACEMENT_STATUS.NOT_PLACED]: 'Not Placed',
        [PLACEMENT_STATUS.INTERVIEW]: 'Interview',
        [PLACEMENT_STATUS.SELECTED]: 'Selected',
        [PLACEMENT_STATUS.OFFERED]: 'Offer Received',
        [PLACEMENT_STATUS.PLACED]: 'Placed'
    };
    return statusMap[status] || status;
};
// File Helpers
export const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};
export const isImageFile = (file) => {
    return file.type.startsWith('image/');
};
// Number Helpers
export const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
};
export const calculatePercentage = (value, total) => {
    if (total === 0)
        return 0;
    return Math.round((value / total) * 100);
};
// URL Helpers
export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, String(value));
        }
    });
    return searchParams.toString();
};
export const getQueryParams = (url) => {
    const params = {};
    const urlParams = new URLSearchParams(new URL(url).search);
    urlParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
};
