import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface DriveDetailsComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-drive-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drive-details.component.html',
  styleUrl: './drive-details.component.css'
})
export class DriveDetailsComponent {
  readonly title = 'Drive Details';
  readonly subtitle = 'Inspect drive progress, applicant flow, and milestone completion across the hiring pipeline.';

  readonly metrics: DriveDetailsComponentMetric[] = [
    {
      label: 'Active Items',
      value: '24',
      note: 'Live PTO workload for this section'
    },
    {
      label: 'Pending Actions',
      value: '08',
      note: 'Needs PTO review or follow-up'
    },
    {
      label: 'Completed This Week',
      value: '15',
      note: 'Recently closed tasks and updates'
    }
  ];

  readonly highlights = [
    'Keep this component connected to PTO services as data models are finalized.',
    'Use this screen for section-specific workflows, approvals, and reporting.',
    'The layout is ready for routing, tables, filters, and dashboard widgets.'
  ];
}
