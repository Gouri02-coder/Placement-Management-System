import { Injectable } from '@angular/core';

import { PtoDashboardData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PtoService {
  getDashboardData(): PtoDashboardData {
    return {
      title: 'PTO Dashboard',
      subtitle: 'Central control room for placement operations, approvals, and reporting.',
      metrics: [
        { label: 'Students Pending Verification', value: '24', note: 'Profiles awaiting PTO review' },
        { label: 'Companies Awaiting Approval', value: '9', note: 'Recruiters blocked on document checks' },
        { label: 'Active Placement Drives', value: '14', note: 'Ongoing drives across departments' }
      ],
      quickLinks: [
        {
          label: 'Student Verification',
          description: 'Review documents, CGPA, and placement readiness.',
          route: '/placement/verify-students'
        },
        {
          label: 'Company Verification',
          description: 'Approve recruiters and hiring partners.',
          route: '/placement/verify-companies'
        },
        {
          label: 'Placement Monitoring',
          description: 'Track drive stages and offer progress.',
          route: '/placement/monitor-placements'
        }
      ],
      activities: [
        {
          title: 'BlueOrbit Analytics approval review',
          detail: 'Compensation approval sheet still pending.',
          status: 'Needs Attention'
        },
        {
          title: 'ApexNova final interviews',
          detail: 'Interview panels confirmed for tomorrow.',
          status: 'On Track'
        },
        {
          title: 'January visit report',
          detail: 'Campus engagement report shared with coordinators.',
          status: 'Completed'
        }
      ]
    };
  }
}

