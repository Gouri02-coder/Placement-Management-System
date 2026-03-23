



export interface PtoMetric {
  label: string;
  value: string;
  note: string;
}

export interface PtoQuickLink {
  label: string;
  description: string;
  route: string;
}

export interface PtoActivity {
  title: string;
  detail: string;
  status: 'On Track' | 'Needs Attention' | 'Completed';
}

export interface PtoDashboardData {
  title: string;
  subtitle: string;
  metrics: PtoMetric[];
  quickLinks: PtoQuickLink[];
  activities: PtoActivity[];
}
