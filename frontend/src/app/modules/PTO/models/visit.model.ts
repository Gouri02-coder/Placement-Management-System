export type VisitStatus = 'Scheduled' | 'Completed' | 'Follow-up Pending';

export interface Visit {
  id: string;
  companyName: string;
  purpose: string;
  date: string;
  pointOfContact: string;
  status: VisitStatus;
}

export interface VisitReport {
  visitId: string;
  summary: string;
  recruiterFeedback: string;
  nextSteps: string[];
}
