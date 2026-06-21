import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DemoApplication } from '../demo-applications.data';
import { JobPortalStoreService } from '../../../services/job-portal-store.service';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.css'
})
export class ApplicationDetailsComponent implements OnInit {
  application: DemoApplication | null = null;

  constructor(
    private route: ActivatedRoute,
    private jobPortalStore: JobPortalStoreService
  ) {}

  ngOnInit(): void {
    this.application = this.jobPortalStore.getApplicationById(this.route.snapshot.paramMap.get('id'));
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
