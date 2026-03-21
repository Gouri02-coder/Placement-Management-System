// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile'
  },

  // Student endpoints
  STUDENT: {
    BASE: '/students',
    PROFILE: '/students/profile',
    APPLICATIONS: '/students/applications',
    INTERVIEWS: '/students/interviews',
    RESUME: '/students/resume'
  },

  // Company endpoints
  COMPANY: {
    BASE: '/companies',
    PROFILE: '/companies/profile',
    JOBS: '/companies/jobs',
    APPLICATIONS: '/companies/applications',
    INTERVIEWS: '/companies/interviews'
  },

  // Admin endpoints
  ADMIN: {
    BASE: '/admin',
    USERS: '/admin/users',
    STUDENTS: '/admin/students',
    COMPANIES: '/admin/companies',
    DRIVES: '/admin/drives',
    REPORTS: '/admin/reports'
  },

  // Job endpoints
  JOBS: {
    BASE: '/jobs',
    APPLY: '/jobs/apply',
    SEARCH: '/jobs/search'
  },

  // Application endpoints
  APPLICATIONS: {
    BASE: '/applications',
    STATUS: '/applications/status'
  },

  // Interview endpoints
  INTERVIEWS: {
    BASE: '/interviews',
    SCHEDULE: '/interviews/schedule',
    FEEDBACK: '/interviews/feedback'
  }
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin',
  TPO: 'tpo'
} as const;

// Application Status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  SELECTED: 'selected',
  INTERVIEW_SCHEDULED: 'interview_scheduled'
} as const;

// Job Types
export const JOB_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract'
} as const;

// Job Categories
export const JOB_CATEGORIES = {
  IT: 'IT',
  ENGINEERING: 'Engineering',
  BUSINESS: 'Business',
  DESIGN: 'Design',
  MARKETING: 'Marketing',
  OTHER: 'Other'
} as const;

// Interview Types
export const INTERVIEW_TYPES = {
  TECHNICAL: 'technical',
  HR: 'hr',
  MANAGERIAL: 'managerial',
  GROUP_DISCUSSION: 'group_discussion'
} as const;

// Interview Modes
export const INTERVIEW_MODES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid'
} as const;

// Placement Status
export const PLACEMENT_STATUS = {
  NOT_PLACED: 'not_placed',
  INTERVIEW: 'interview',
  SELECTED: 'selected',
  OFFERED: 'offered',
  PLACED: 'placed'
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[6-9]\d{9}$/,
  PINCODE: /^\d{6}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// File Upload Constraints
export const FILE_CONSTRAINTS = {
  RESUME: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  PROFILE_IMAGE: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  },
  COMPANY_LOGO: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']
  }
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [5, 10, 25, 50]
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'current_user',
  USER_ROLE: 'user_role',
  THEME: 'theme'
};

// Route Paths
export const ROUTE_PATHS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    PROFILE: '/student/profile',
    JOBS: '/student/jobs',
    APPLICATIONS: '/student/applications',
    INTERVIEWS: '/student/interviews'
  },
  COMPANY: {
    DASHBOARD: '/company/dashboard',
    PROFILE: '/company/profile',
    JOBS: '/company/jobs',
    APPLICATIONS: '/company/applications',
    INTERVIEWS: '/company/interviews'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    STUDENTS: '/admin/students',
    COMPANIES: '/admin/companies',
    DRIVES: '/admin/drives',
    REPORTS: '/admin/reports'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully.',
  JOB_POSTED: 'Job posted successfully.',
  APPLICATION_SUBMITTED: 'Application submitted successfully.',
  INTERVIEW_SCHEDULED: 'Interview scheduled successfully.',
  PASSWORD_RESET: 'Password reset successfully.'
};