import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DemoApplication } from '../demo-applications.data';
import { JobPortalStoreService } from '../../../services/job-portal-store.service';

@Component({
  selector: 'app-application-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './application-edit.component.html',
  styleUrl: './application-edit.component.css'
})
export class ApplicationEditComponent implements OnInit {
  application: DemoApplication | null = null;
  isSaved = false;
  form = {
    locationPreference: '',
    resumeUrl: '',
    coverLetter: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPortalStore: JobPortalStoreService
  ) {}

  ngOnInit(): void {
    this.application = this.jobPortalStore.getApplicationById(this.route.snapshot.paramMap.get('id'));
    if (this.application) {
      this.form = {
        locationPreference: this.application.locationPreference,
        resumeUrl: this.application.resumeUrl,
        coverLetter: this.application.coverLetter || ''
      };
    }
  }

  save(): void {
    if (!this.application) {
      return;
    }

    this.jobPortalStore.updateApplication(this.application.id, {
      locationPreference: this.form.locationPreference.trim(),
      resumeUrl: this.form.resumeUrl.trim(),
      coverLetter: this.form.coverLetter.trim()
    });
    this.application = this.jobPortalStore.getApplicationById(this.application.id);
    this.isSaved = true;
  }

  goToDetails(): void {
    if (!this.application) {
      return;
    }

    void this.router.navigate(['/student/applications/details', this.application.id]);
  }

  getStatusLabel(status: string): string {
    return status === 'under-review'
      ? 'Under Review'
      : status.charAt(0).toUpperCase() + status.slice(1);
  }

  getStatusTone(status: string): string {
    switch (status) {
      case 'selected':
        return 'tone-selected';
      case 'shortlisted':
        return 'tone-shortlisted';
      case 'under-review':
        return 'tone-review';
      case 'rejected':
        return 'tone-rejected';
      default:
        return 'tone-applied';
    }
  }
}
