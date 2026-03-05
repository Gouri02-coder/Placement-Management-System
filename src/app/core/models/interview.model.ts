export interface Interview {
  id: number;
  applicationId: number;
  title: string;
  description?: string;
  interviewDate: Date;
  duration: number;
  interviewType: InterviewType;
  mode: InterviewMode;
  location?: string;
  meetingLink?: string;
  interviewer: string;
  status: InterviewStatus;
  feedback?: InterviewFeedback;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewFeedback {
  technicalSkills: number;
  communicationSkills: number;
  problemSolving: number;
  culturalFit: number;
  overallRating: number;
  strengths: string[];
  areasOfImprovement: string[];
  comments: string;
  recommendation: Recommendation;
}

export enum InterviewType {
  TECHNICAL = 'technical',
  HR = 'hr',
  MANAGERIAL = 'managerial',
  GROUP_DISCUSSION = 'group_discussion'
}

export enum InterviewMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

export enum Recommendation {
  STRONG_HIRE = 'strong_hire',
  HIRE = 'hire',
  NO_HIRE = 'no_hire',
  STRONG_NO_HIRE = 'strong_no_hire'
}