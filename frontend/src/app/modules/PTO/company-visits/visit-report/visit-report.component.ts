import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface VisitReportComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-visit-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-report.component.html',
  styleUrl: './visit-report.component.css'
})
export class VisitReportComponent {
  readonly title = 'Visit Report';
  readonly subtitle = 'Summarize meeting outcomes, recruiter feedback, and follow-up actions after company visits.';

  readonly metrics: VisitReportComponentMetric[] = [
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
