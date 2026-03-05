import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface InterviewSchedule {
  id: string;
  companyName: string;
  jobTitle: string;
  interviewType: 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
  interviewDate: Date;
  duration: number; // in minutes
  interviewer: string;
  interviewLink?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  preparationNotes: string;
  feedback?: string;
  reminder: boolean;
}

@Component({
  selector: 'app-interview-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-schedule.component.html',
  styleUrls: ['./interview-schedule.component.css']
})
export class InterviewScheduleComponent implements OnInit {
  interviews: InterviewSchedule[] = [];
  filteredInterviews: InterviewSchedule[] = [];
  selectedInterview: InterviewSchedule | null = null;
  showInterviewForm = false;
  isEditing = false;

  // Filters
  statusFilter = '';
  dateFilter = '';

  // New interview form
  newInterview: InterviewSchedule = {
    id: '',
    companyName: '',
    jobTitle: '',
    interviewType: 'video',
    interviewDate: new Date(),
    duration: 60,
    interviewer: '',
    interviewLink: '',
    location: '',
    status: 'scheduled',
    preparationNotes: '',
    reminder: true
  };

  // Calendar view
  calendarView: 'list' | 'calendar' = 'list';
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.loadSampleData();
    this.filterInterviews();
  }

  loadSampleData(): void {
    this.interviews = [
      {
        id: '1',
        companyName: 'Tech Innovations Inc.',
        jobTitle: 'Software Engineer',
        interviewType: 'technical',
        interviewDate: new Date('2024-02-15T14:00:00'),
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
        interviewDate: new Date('2024-02-20T10:30:00'),
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
        interviewDate: new Date('2024-02-10T09:00:00'),
        duration: 120,
        interviewer: 'Mike Wilson',
        location: '123 Tech Park, Bangalore',
        status: 'completed',
        preparationNotes: 'Review Angular concepts and JavaScript fundamentals.',
        feedback: 'Good technical skills but need improvement in communication.',
        reminder: false
      }
    ];
  }

  filterInterviews(): void {
    this.filteredInterviews = this.interviews.filter(interview => {
      const matchesStatus = !this.statusFilter || interview.status === this.statusFilter;
      
      let matchesDate = true;
      if (this.dateFilter === 'today') {
        const today = new Date();
        matchesDate = interview.interviewDate.toDateString() === today.toDateString();
      } else if (this.dateFilter === 'upcoming') {
        matchesDate = interview.interviewDate > new Date();
      } else if (this.dateFilter === 'past') {
        matchesDate = interview.interviewDate < new Date();
      }
      
      return matchesStatus && matchesDate;
    });
  }

  viewInterview(interview: InterviewSchedule): void {
    this.selectedInterview = interview;
    this.showInterviewForm = false;
  }

  addInterview(): void {
    this.isEditing = false;
    this.newInterview = {
      id: Date.now().toString(),
      companyName: '',
      jobTitle: '',
      interviewType: 'video',
      interviewDate: new Date(),
      duration: 60,
      interviewer: '',
      interviewLink: '',
      location: '',
      status: 'scheduled',
      preparationNotes: '',
      reminder: true
    };
    this.showInterviewForm = true;
    this.selectedInterview = null;
  }

  editInterview(interview: InterviewSchedule): void {
    this.isEditing = true;
    this.newInterview = { ...interview };
    this.showInterviewForm = true;
    this.selectedInterview = null;
  }

  saveInterview(): void {
    if (this.isEditing) {
      const index = this.interviews.findIndex(i => i.id === this.newInterview.id);
      if (index !== -1) {
        this.interviews[index] = { ...this.newInterview };
      }
    } else {
      this.interviews.unshift({ ...this.newInterview });
    }
    this.showInterviewForm = false;
    this.filterInterviews();
  }

  deleteInterview(interview: InterviewSchedule): void {
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviews = this.interviews.filter(i => i.id !== interview.id);
      this.filterInterviews();
      if (this.selectedInterview?.id === interview.id) {
        this.selectedInterview = null;
      }
    }
  }

  cancelInterview(interview: InterviewSchedule): void {
    if (confirm('Are you sure you want to cancel this interview?')) {
      interview.status = 'cancelled';
      this.filterInterviews();
    }
  }

  rescheduleInterview(interview: InterviewSchedule): void {
    this.editInterview(interview);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled': return '#3498db';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      case 'rescheduled': return '#f39c12';
      default: return '#95a5a6';
    }
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getInterviewTypeIcon(type: string): string {
    switch (type) {
      case 'phone': return '📞';
      case 'video': return '🎥';
      case 'onsite': return '🏢';
      case 'technical': return '💻';
      case 'hr': return '👔';
      default: return '📅';
    }
  }

  isUpcoming(interview: InterviewSchedule): boolean {
    return interview.status === 'scheduled' && interview.interviewDate > new Date();
  }

  getTimeUntilInterview(interview: InterviewSchedule): string {
    const now = new Date();
    const diff = interview.interviewDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return 'Less than an hour';
    }
  }

  joinInterview(interview: InterviewSchedule): void {
    if (interview.interviewLink) {
      window.open(interview.interviewLink, '_blank');
    } else {
      alert('No interview link provided.');
    }
  }

  setReminder(interview: InterviewSchedule): void {
    interview.reminder = !interview.reminder;
    if (interview.reminder) {
      alert(`Reminder set for interview with ${interview.companyName}`);
    }
  }

  // Calendar view methods
  getDaysInMonth(): Date[] {
    const days = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    for (let day = new Date(firstDay); day <= lastDay; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day));
    }
    
    return days;
  }

  getInterviewsForDate(date: Date): InterviewSchedule[] {
    return this.interviews.filter(interview => 
      interview.interviewDate.toDateString() === date.toDateString()
    );
  }

  changeMonth(direction: number): void {
    this.currentMonth += direction;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
  }

  getMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}
}