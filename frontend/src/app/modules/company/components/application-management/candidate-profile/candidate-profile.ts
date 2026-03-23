import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, UpperCasePipe, DatePipe, FormsModule],
  templateUrl: './candidate-profile.html',
  styleUrls: ['./candidate-profile.css']
})
export class CandidateProfileComponent implements OnInit {
  application: any = null;
  isLoading = false;
  error: string | null = null;
  applicationId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplication();
  }

  private loadApplication(): void {
    this.isLoading = true;
    this.applicationId = this.route.snapshot.paramMap.get('id');
    
    if (!this.applicationId) {
      this.error = 'Application ID not found';
      this.isLoading = false;
      return;
    }

    // Simulate API call - replace with actual service
    setTimeout(() => {
      // Mock data - replace with actual API call
      this.application = {
        id: this.applicationId,
        jobId: 'job_001',
        jobTitle: 'Frontend Developer',
        studentId: 'stud_001',
        candidateName: 'John Doe',
        candidateEmail: 'john.doe@example.com',
        candidatePhone: '+91 9876543210',
        branch: 'Computer Science',
        cgpa: 8.5,
        yearOfPassing: 2024,
        skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'RxJS', 'Git'],
        resumeUrl: 'https://example.com/resumes/john_doe.pdf',
        coverLetter: 'I am writing to express my strong interest in the Frontend Developer position at your company. With over 2 years of experience in building responsive web applications using Angular and React, I am confident in my ability to contribute effectively to your team.\n\nThroughout my academic and professional journey, I have developed a strong foundation in frontend technologies. I have successfully delivered multiple projects, including an e-commerce platform and a real-time dashboard. My experience with state management, API integration, and performance optimization has prepared me to tackle complex challenges.\n\nI am particularly drawn to your company because of its innovative approach and commitment to excellence. I am eager to bring my skills in TypeScript, RxJS, and modern frontend frameworks to help create exceptional user experiences.\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.',
        status: 'shortlisted',
        appliedAt: new Date('2024-03-15T10:30:00'),
        updatedAt: new Date('2024-03-20T14:45:00'),
        additionalNotes: 'Strong problem-solving skills. Good communication. Open to relocation.'
      };
      this.isLoading = false;
    }, 1000);
  }

  getStatusClass(status: string | null): string {
    if (!status) return 'status-unknown';
    return `status-${status.toLowerCase()}`;
  }

  getStatusIcon(status: string | null): string {
    if (!status) return 'help';
    
    const statusIcons: { [key: string]: string } = {
      pending: 'schedule',
      reviewed: 'visibility',
      shortlisted: 'star',
      rejected: 'cancel',
      hired: 'check_circle'
    };
    
    return statusIcons[status.toLowerCase()] || 'help';
  }

  updateStatus(newStatus: string): void {
    if (this.application && confirm(`Are you sure you want to change the status to ${newStatus.toUpperCase()}?`)) {
      this.application.status = newStatus;
      this.application.updatedAt = new Date();
      
      // Add your API call here to update status
      console.log('Status updated to:', newStatus);
      
      // Show success message
      alert(`Application status updated to ${newStatus.toUpperCase()}`);
    }
  }

  goBack(): void {
    this.router.navigate(['/company/applications']);
  }

  viewResume(): void {
    if (this.application?.resumeUrl) {
      window.open(this.application.resumeUrl, '_blank');
    } else {
      alert('Resume not available.');
    }
  }

  downloadResume(): void {
    if (this.application?.resumeUrl) {
      const link = document.createElement('a');
      link.href = this.application.resumeUrl;
      link.download = `${this.application.candidateName}_resume.pdf`;
      link.click();
    } else {
      alert('Resume not available for download.');
    }
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', 
      '#3b82f6', '#8b5cf6', '#ec489a', '#06b6d4', '#84cc16'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    
    return colors[index];
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  canEditStatus(): boolean {
    return this.application?.status !== 'hired' && this.application?.status !== 'rejected';
  }

  getStatusOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'reviewed', label: 'Reviewed' },
      { value: 'shortlisted', label: 'Shortlisted' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'hired', label: 'Hired' }
    ];
  }
}