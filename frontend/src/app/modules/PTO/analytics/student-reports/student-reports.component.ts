import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface StudentReportsComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-student-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-reports.component.html',
  styleUrl: './student-reports.component.css'
})
export class StudentReportsComponent {
  readonly title = 'Student Reports';
  readonly subtitle = 'Measure student readiness, verification outcomes, and placement participation trends.';

  readonly metrics: StudentReportsComponentMetric[] = [
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
