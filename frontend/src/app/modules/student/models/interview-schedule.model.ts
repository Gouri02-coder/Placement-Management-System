export interface InterviewSchedule {
  id: string;
  companyName: string;
  jobTitle: string;
  interviewType: 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
  interviewDate: Date;
  duration: number;
  interviewer: string;
  interviewLink?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  preparationNotes: string;
  feedback?: string;
  reminder: boolean;
}
