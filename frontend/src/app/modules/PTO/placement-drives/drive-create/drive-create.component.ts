import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface DriveCreateComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-drive-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drive-create.component.html',
  styleUrl: './drive-create.component.css'
})
export class DriveCreateComponent {
  readonly title = 'Create Drive';
  readonly subtitle = 'Prepare a new placement drive with scheduling, eligibility, and recruiter coordination details.';

  readonly metrics: DriveCreateComponentMetric[] = [
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
