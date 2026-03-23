import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface CompanyReportsComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-company-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-reports.component.html',
  styleUrl: './company-reports.component.css'
})
export class CompanyReportsComponent {
  readonly title = 'Company Reports';
  readonly subtitle = 'Track recruiter engagement, approval rates, and company activity across the placement season.';

  readonly metrics: CompanyReportsComponentMetric[] = [
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
