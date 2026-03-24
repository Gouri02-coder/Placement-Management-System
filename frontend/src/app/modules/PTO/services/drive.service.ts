import { Injectable } from '@angular/core';

import { Drive, DriveFormDraft } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  getDrives(): Drive[] {
    return [
      {
        id: 'DRV-201',
        companyName: 'ApexNova Technologies',
        role: 'Graduate Engineer Trainee',
        packageLpa: '7.5',
        eligibleDepartments: ['CSE', 'IT', 'ECE'],
        scheduledDate: '2026-03-28',
        stage: 'Interview',
        applicants: 126
      },
      {
        id: 'DRV-202',
        companyName: 'BlueOrbit Analytics',
        role: 'Data Analyst',
        packageLpa: '6.8',
        eligibleDepartments: ['CSE', 'IT', 'MBA'],
        scheduledDate: '2026-04-04',
        stage: 'Assessment',
        applicants: 94
      }
    ];
  }

  getDriveDraft(): DriveFormDraft {
    return {
      companyName: '',
      role: '',
      packageLpa: '',
      scheduledDate: '',
      eligibleDepartments: [],
      minimumCgpa: 7
    };
  }
}

