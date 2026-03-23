import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface VisitListComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-list.component.html',
  styleUrl: './visit-list.component.css'
})
export class VisitListComponent {
  readonly title = 'Visit List';
  readonly subtitle = 'Review all scheduled and completed company visits across the current placement cycle.';

  readonly metrics: VisitListComponentMetric[] = [
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
