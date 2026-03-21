export interface Interview {
  id: string;
  applicationId: string;
  studentId: string;
  companyId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  schedule: {
    date: Date;
    time: string;
    duration: number;
    mode: 'online' | 'in-person';
    venue?: string;
    meetingLink?: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  preparation: {
    topics: string[];
    materials: string[];
    instructions: string;
  };
  feedback?: {
    rating: number;
    comments: string;
    strengths: string[];
    areasForImprovement: string[];
    decision: 'selected' | 'rejected' | 'next-round';
  };
}