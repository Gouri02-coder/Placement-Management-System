import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.html',
  standalone: true,
  imports: [CommonModule, UpperCasePipe, DatePipe]
})
export class CandidateProfileComponent {
  application: any = null; // Initialize as null
  isLoading = false;

  constructor(private router: Router) {}

  // Safe methods that handle null application
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
    if (this.application) {
      this.application.status = newStatus;
      // Add your API call here to update status
    }
  }

  goBack(): void {
    this.router.navigate(['/company/applications']);
  }

  viewResume(): void {
    if (this.application?.resumeUrl) {
      // Implement view resume logic
      window.open(this.application.resumeUrl, '_blank');
    }
  }

  downloadResume(): void {
    if (this.application?.resumeUrl) {
      // Implement download resume logic
      const link = document.createElement('a');
      link.href = this.application.resumeUrl;
      link.download = 'resume.pdf';
      link.click();
    }
  }
}