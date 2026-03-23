import { Injectable } from '@angular/core';

import { Visit, VisitReport } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  getVisits(): Visit[] {
    return [
      {
        id: 'VIS-301',
        companyName: 'ApexNova Technologies',
        purpose: 'Pre-placement talk and process alignment',
        date: '2026-03-24',
        pointOfContact: 'Neha Kapoor',
        status: 'Scheduled'
      },
      {
        id: 'VIS-302',
        companyName: 'CoreGrid Manufacturing',
        purpose: 'Relationship visit and intake review',
        date: '2026-03-12',
        pointOfContact: 'Karan Mehta',
        status: 'Completed'
      }
    ];
  }

  getVisitReports(): VisitReport[] {
    return [
      {
        visitId: 'VIS-302',
        summary: 'The recruiter team confirmed hiring targets for core operations roles.',
        recruiterFeedback: 'Requested stronger pre-screening for aptitude readiness.',
        nextSteps: [
          'Share shortlisted student pool by department',
          'Finalize test window with company SPOC'
        ]
      }
    ];
  }
}

