import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface PlacementDriveStatus {
  company: string;
  role: string;
  applied: number;
  shortlisted: number;
  offers: number;
  stage: string;
}

@Component({
  selector: 'app-placement-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement-monitor.html',
  styleUrls: ['./placement-monitor.css']
})
export class PlacementMonitorComponent {
  readonly metrics = [
    { label: 'Students Placed', value: '186', note: '42 more than last cycle' },
    { label: 'Offers Released', value: '214', note: '92 percent acceptance rate' },
    { label: 'Companies Engaged', value: '37', note: '6 new recruiters this month' }
  ];

  readonly drives: PlacementDriveStatus[] = [
    {
      company: 'Elevate Tech',
      role: 'Graduate Engineer Trainee',
      applied: 126,
      shortlisted: 38,
      offers: 11,
      stage: 'HR Interviews'
    },
    {
      company: 'BluePeak Analytics',
      role: 'Data Analyst',
      applied: 94,
      shortlisted: 24,
      offers: 7,
      stage: 'Offer Rollout'
    },
    {
      company: 'Vertex Manufacturing',
      role: 'Operations Associate',
      applied: 71,
      shortlisted: 19,
      offers: 0,
      stage: 'Aptitude Test'
    }
  ];
}
