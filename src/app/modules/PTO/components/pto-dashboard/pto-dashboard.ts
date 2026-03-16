import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyVerificationComponent } from '../company-verification/company-verification';
import { PlacementMonitorComponent } from '../placement-monitor/placement-monitor';
import { StudentVerificationComponent } from '../student-verification/student-verification';

@Component({
  selector: 'app-pto-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StudentVerificationComponent,
    CompanyVerificationComponent,
    PlacementMonitorComponent
  ],
  templateUrl: './pto-dashboard.html',
  styleUrls: ['./pto-dashboard.css']
})
export class PtoDashboardComponent {
  readonly highlights = [
    {
      title: 'Students Pending Verification',
      value: '24',
      detail: '8 profiles uploaded new documents today'
    },
    {
      title: 'Companies Awaiting Approval',
      value: '9',
      detail: '3 recruiters need document validation'
    },
    {
      title: 'Active Placement Drives',
      value: '14',
      detail: '5 drives are currently in interview stages'
    }
  ];

  readonly quickLinks = [
    {
      label: 'Verify Students',
      description: 'Review student profile, CGPA, and resume validation status.',
      route: '/placement/verify-students'
    },
    {
      label: 'Verify Companies',
      description: 'Approve recruiter documents, HR contacts, and hiring readiness.',
      route: '/placement/verify-companies'
    },
    {
      label: 'Monitor Placements',
      description: 'Track drive progress, offer counts, and placement conversion.',
      route: '/placement/monitor-placements'
    }
  ];
}
