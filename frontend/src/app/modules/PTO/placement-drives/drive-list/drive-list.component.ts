import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface DriveListComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-drive-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drive-list.component.html',
  styleUrl: './drive-list.component.css'
})
export class DriveListComponent {
  readonly title = 'Drive List';
  readonly subtitle = 'View active, upcoming, and completed placement drives with PTO-level monitoring.';

  readonly metrics: DriveListComponentMetric[] = [
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
