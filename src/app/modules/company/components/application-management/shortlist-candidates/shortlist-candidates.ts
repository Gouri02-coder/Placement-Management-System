import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/application.model';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';


@Component({
  selector: 'app-shortlist-candidates',
  standalone: true,
  imports: [DatePipe, UpperCasePipe,CommonModule],
  templateUrl: './shortlist-candidates.html',
  styleUrls: ['./shortlist-candidates.css']
})
export class ShortlistCandidatesComponent implements OnInit {
  shortlistedApplications: Application[] = [];
  isLoading = false;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadShortlistedCandidates();
  }

  private loadShortlistedCandidates(): void {
    this.isLoading = true;
    const companyId = this.getCompanyId();
    
    const filters = { status: 'shortlisted' };
    this.applicationService.getApplicationsByCompany(companyId, filters).subscribe({
      next: (applications) => {
        this.shortlistedApplications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading shortlisted candidates:', error);
        this.isLoading = false;
      }
    });
  }

  private getCompanyId(): string {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).companyId : '';
  }

  removeFromShortlist(applicationId: string): void {
    if (confirm('Are you sure you want to remove this candidate from shortlist?')) {
      this.applicationService.updateApplicationStatus({
        applicationId,
        status: 'reviewed'
      }).subscribe({
        next: () => {
          this.shortlistedApplications = this.shortlistedApplications.filter(
            app => app.id !== applicationId
          );
          alert('Candidate removed from shortlist.');
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Error removing candidate from shortlist.');
        }
      });
    }
  }

  hireCandidate(applicationId: string): void {
    if (confirm('Are you sure you want to mark this candidate as hired?')) {
      this.applicationService.updateApplicationStatus({
        applicationId,
        status: 'hired'
      }).subscribe({
        next: () => {
          this.shortlistedApplications = this.shortlistedApplications.filter(
            app => app.id !== applicationId
          );
          alert('Candidate marked as hired!');
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Error updating candidate status.');
        }
      });
    }
  }

  viewResume(resumeUrl: string): void {
    window.open(resumeUrl, '_blank');
  }

  getSkillLevel(skills: string[]): string {
    const count = skills.length;
    if (count >= 8) return 'expert';
    if (count >= 5) return 'advanced';
    if (count >= 3) return 'intermediate';
    return 'beginner';
  }

  getSkillLevelClass(skills: string[]): string {
    const level = this.getSkillLevel(skills);
    return `skill-level-${level}`;
  }

      getUniqueJobs(): string[] {
      const jobs = [...new Set(this.shortlistedApplications.map(app => app.jobTitle))];
      return jobs;
    }

    getAverageCGPA(): number {
      if (this.shortlistedApplications.length === 0) return 0;
      const total = this.shortlistedApplications.reduce((sum, app) => sum + app.cgpa, 0);
      return total / this.shortlistedApplications.length;
    }
}
