import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-application-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.css']
})
export class ApplicationStatusComponent implements OnInit {
  applications: Application[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyApplications();
  }

  loadMyApplications(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser?.id) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.applicationService.getStudentApplications(currentUser.id.toString())
      .pipe(
        map(data => data.map(app => ({
          ...app,
          appliedDate: new Date(app.appliedDate),
          interview: app.interview ? {
            ...app.interview,
            scheduledDate: app.interview.scheduledDate ? new Date(app.interview.scheduledDate) : undefined
          } : undefined
        })))
      )
      .subscribe({
        next: (data) => {
          this.applications = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load applications.';
          this.isLoading = false;
        }
      });
  }

  getApplicationsByStatus(status: string): Application[] {
    return this.applications.filter(app => app.status.toLowerCase().includes(status.toLowerCase()));
  }

  getStatusColor(status: string): string {
    const colors: any = { 'applied': '#3498db', 'shortlisted': '#27ae60', 'rejected': '#e74c3c' };
    return colors[status.toLowerCase()] || '#95a5a6';
  }

  getStatusLabel(status: string): string {
    return status.replace('-', ' ').toUpperCase();
  }
}