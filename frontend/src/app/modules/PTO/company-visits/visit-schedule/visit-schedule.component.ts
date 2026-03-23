import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface VisitScheduleComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-visit-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-schedule.component.html',
  styleUrl: './visit-schedule.component.css'
})
export class VisitScheduleComponent {
  readonly title = 'Visit Schedule';
  readonly subtitle = 'Plan upcoming recruiter visits, onboarding meetings, and pre-drive coordination sessions.';

  readonly metrics: VisitScheduleComponentMetric[] = [
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
