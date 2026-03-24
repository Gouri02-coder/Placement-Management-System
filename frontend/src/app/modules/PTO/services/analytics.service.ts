import { Injectable } from '@angular/core';

import { CompanyReport, PlacementStat, StudentReport } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  getPlacementStats(): PlacementStat[] {
    return [
      { label: 'Students Placed', value: '186', note: '42 more than the last cycle' },
      { label: 'Offers Released', value: '214', note: 'Strong offer momentum this quarter' },
      { label: 'Companies Engaged', value: '37', note: '6 new recruiters this month' }
    ];
  }

  getCompanyReports(): CompanyReport[] {
    return [
      {
        companyName: 'ApexNova Technologies',
        totalDrives: 2,
        offersReleased: 18,
        approvalStatus: 'Approved'
      },
      {
        companyName: 'BlueOrbit Analytics',
        totalDrives: 1,
        offersReleased: 7,
        approvalStatus: 'Pending'
      }
    ];
  }

  getStudentReports(): StudentReport[] {
    return [
      {
        department: 'Computer Science',
        totalStudents: 120,
        verifiedStudents: 110,
        placedStudents: 74
      },
      {
        department: 'Information Technology',
        totalStudents: 90,
        verifiedStudents: 79,
        placedStudents: 51
      }
    ];
  }
}

