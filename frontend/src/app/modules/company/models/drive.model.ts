export interface PlacementDrive {
  id: string;
  companyId: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'onsite' | 'virtual';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  rounds: DriveRound[];
  participants: DriveParticipant[];
  selectedCount: number;
  totalParticipants: number;
  instructions?: string;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DriveRound {
  id: string;
  name: string;
  type: 'aptitude' | 'technical' | 'hr' | 'group_discussion' | 'presentation';
  date: Date;
  duration: number;
  venue?: string;
  instructions?: string;
  maxMarks: number;
  passingMarks: number;
  completed: boolean;
  resultsPublished: boolean;
}

export interface DriveParticipant {
  studentId: string;
  studentName: string;
  branch: string;
  status: 'registered' | 'appeared' | 'absent';
  roundResults: RoundResult[];
  finalStatus: 'selected' | 'rejected' | 'pending';
}

export interface RoundResult {
  roundId: string;
  marks: number;
  feedback?: string;
  status: 'pass' | 'fail' | 'pending';
}