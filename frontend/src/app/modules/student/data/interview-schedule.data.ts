import { InterviewSchedule } from '../models/interview-schedule.model';

const STUDENT_INTERVIEWS: InterviewSchedule[] = [
  {
    id: '1',
    companyName: 'Tech Innovations Inc.',
    jobTitle: 'Software Engineer',
    interviewType: 'technical',
    interviewDate: new Date('2026-03-31T14:00:00'),
    duration: 90,
    interviewer: 'John Smith',
    interviewLink: 'https://meet.google.com/abc-def-ghi',
    status: 'scheduled',
    preparationNotes: 'Review data structures and algorithms. Practice system design questions.',
    reminder: true
  },
  {
    id: '2',
    companyName: 'Data Systems Ltd.',
    jobTitle: 'Data Analyst',
    interviewType: 'video',
    interviewDate: new Date('2026-04-02T10:30:00'),
    duration: 60,
    interviewer: 'Sarah Johnson',
    interviewLink: 'https://zoom.us/j/123456789',
    status: 'scheduled',
    preparationNotes: 'Prepare SQL queries and statistical analysis examples.',
    reminder: true
  },
  {
    id: '3',
    companyName: 'Web Solutions Co.',
    jobTitle: 'Frontend Developer',
    interviewType: 'onsite',
    interviewDate: new Date('2026-03-25T09:00:00'),
    duration: 120,
    interviewer: 'Mike Wilson',
    location: '123 Tech Park, Bangalore',
    status: 'completed',
    preparationNotes: 'Review Angular concepts and JavaScript fundamentals.',
    feedback: 'Good technical skills but need improvement in communication.',
    reminder: false
  }
];

export function cloneStudentInterviews(): InterviewSchedule[] {
  return STUDENT_INTERVIEWS.map(interview => ({
    ...interview,
    interviewDate: new Date(interview.interviewDate)
  }));
}
