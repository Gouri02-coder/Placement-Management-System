import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface JobPosting {
  id: number;
  company: string;
  position: string;
  location: string;
  salary: string;
  deadline: string;
  type: string;
}

interface Interview {
  id: number;
  company: string;
  position: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit {
  stats = {
    applied: 12,
    interviews: 3,
    offers: 1,
    profile: 85
  };

  recentJobs: JobPosting[] = [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Software Engineer",
      location: "San Francisco, CA",
      salary: "$120,000",
      deadline: "2024-02-15",
      type: "Full-time"
    },
    {
      id: 2,
      company: "DataSystems LLC",
      position: "Data Analyst",
      location: "Remote",
      salary: "$85,000",
      deadline: "2024-02-20",
      type: "Full-time"
    },
    {
      id: 3,
      company: "WebSolutions Ltd",
      position: "Frontend Developer",
      location: "New York, NY",
      salary: "$95,000",
      deadline: "2024-02-18",
      type: "Internship"
    },
    {
      id: 4,
      company: "CloudTech Innovations",
      position: "DevOps Engineer",
      location: "Austin, TX",
      salary: "$110,000",
      deadline: "2024-02-25",
      type: "Full-time"
    }
  ];

  upcomingInterviews: Interview[] = [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Software Engineer",
      date: "2024-02-20",
      time: "10:00 AM",
      type: "Technical",
      status: "Scheduled"
    },
    {
      id: 2,
      company: "DataSystems LLC",
      position: "Data Analyst",
      date: "2024-02-22",
      time: "2:00 PM",
      type: "HR",
      status: "Scheduled"
    },
    {
      id: 3,
      company: "WebSolutions Ltd",
      position: "Frontend Developer",
      date: "2024-02-25",
      time: "11:00 AM",
      type: "Technical",
      status: "Confirmed"
    }
  ];

  quickActions = [
    { icon: '📄', label: 'Update Resume', description: 'Upload your latest resume' },
    { icon: '🔍', label: 'Search Jobs', description: 'Find new opportunities' },
    { icon: '📝', label: 'Practice Tests', description: 'Prepare for interviews' },
    { icon: '👥', label: 'Network', description: 'Connect with recruiters' },
    { icon: '💼', label: 'My Applications', description: 'Track your applications' },
    { icon: '🎯', label: 'Interview Prep', description: 'Practice questions' }
  ];

  ngOnInit(): void {
    console.log('Student Dashboard initialized');
  }

  applyToJob(jobId: number): void {
    const job = this.recentJobs.find(j => j.id === jobId);
    if (job) {
      if (confirm(`Are you sure you want to apply for ${job.position} at ${job.company}?`)) {
        this.stats.applied++;
        // Remove the job from recent jobs after applying
        this.recentJobs = this.recentJobs.filter(j => j.id !== jobId);
        alert(`Successfully applied to ${job.position} at ${job.company}`);
      }
    }
  }

  viewInterviewDetails(interviewId: number): void {
    const interview = this.upcomingInterviews.find(i => i.id === interviewId);
    if (interview) {
      alert(`Interview Details:\n\nCompany: ${interview.company}\nPosition: ${interview.position}\nDate: ${this.formatDate(interview.date)}\nTime: ${interview.time}\nType: ${interview.type}\nStatus: ${interview.status}`);
    }
  }

  completeProfile(): void {
    alert('Redirecting to profile completion page...');
    // In actual implementation, navigate to profile page
  }

  viewAllJobs(): void {
    alert('Redirecting to jobs page...');
  }

  viewAllInterviews(): void {
    alert('Redirecting to interviews page...');
  }

  handleQuickAction(actionLabel: string): void {
    switch(actionLabel) {
      case 'Update Resume':
        alert('Opening resume upload...');
        break;
      case 'Search Jobs':
        this.viewAllJobs();
        break;
      case 'Practice Tests':
        alert('Opening practice tests...');
        break;
      case 'Network':
        alert('Opening networking page...');
        break;
      case 'My Applications':
        alert('Opening applications page...');
        break;
      case 'Interview Prep':
        alert('Opening interview preparation...');
        break;
      default:
        alert(`Action: ${actionLabel}`);
    }
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  getDaysUntilDeadline(deadline: string): string {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Expired';
    return `${diffDays} days left`;
  }

  getInterviewStatusClass(status: string): string {
    switch(status) {
      case 'Scheduled': return 'status-scheduled';
      case 'Confirmed': return 'status-confirmed';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-scheduled';
    }
  }
}