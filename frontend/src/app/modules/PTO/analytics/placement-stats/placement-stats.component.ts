import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface PlacementStatsComponentMetric {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-placement-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement-stats.component.html',
  styleUrl: './placement-stats.component.css'
})
export class PlacementStatsComponent {
  readonly title = 'Placement Stats';
  readonly subtitle = 'Analyze placement conversion, offer velocity, and department-wise hiring performance.';

  readonly metrics: PlacementStatsComponentMetric[] = [
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
