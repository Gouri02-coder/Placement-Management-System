import { Injectable } from '@angular/core';
import { Drive } from './drive.service';

const DRIVE_STORAGE_KEY = 'pto-static-drives';
const DRIVE_STORAGE_VERSION_KEY = 'pto-static-drives-version';
const DRIVE_STORAGE_VERSION = '2026-v2';

@Injectable({
  providedIn: 'root'
})
export class PtoDriveStoreService {
  getDrives(): Drive[] {
    const seedDrives = this.getSeedDrives();
    const needsReseed = localStorage.getItem(DRIVE_STORAGE_VERSION_KEY) !== DRIVE_STORAGE_VERSION;

    if (needsReseed) {
      this.saveDrives(seedDrives);
      return seedDrives;
    }

    const storedDrives = localStorage.getItem(DRIVE_STORAGE_KEY);

    if (storedDrives) {
      try {
        const parsedDrives = JSON.parse(storedDrives) as Drive[];
        if (Array.isArray(parsedDrives)) {
          const mergedDrives = this.mergeSeedDrives(parsedDrives, seedDrives);
          this.saveDrives(mergedDrives);
          return mergedDrives;
        }
      } catch (error) {
        console.error('Error reading saved drives:', error);
      }
    }

    this.saveDrives(seedDrives);
    return seedDrives;
  }

  saveDrives(drives: Drive[]): void {
    localStorage.setItem(DRIVE_STORAGE_KEY, JSON.stringify(drives));
    localStorage.setItem(DRIVE_STORAGE_VERSION_KEY, DRIVE_STORAGE_VERSION);
  }

  getDriveById(id: number): Drive | undefined {
    return this.getDrives().find(drive => drive.id === id);
  }

  private mergeSeedDrives(savedDrives: Drive[], seedDrives: Drive[]): Drive[] {
    const savedIds = new Set(savedDrives.map(drive => drive.id));
    const missingSeedDrives = seedDrives.filter(drive => !savedIds.has(drive.id));

    return [...savedDrives, ...missingSeedDrives];
  }

  getSeedDrives(): Drive[] {
    return [
      {
        id: 1,
        title: 'Campus Recruitment Drive 2026',
        companyName: 'Google',
        companyId: 1,
        description: 'Exciting opportunity for software engineering roles. Looking for passionate developers with strong problem-solving skills.',
        driveType: 'ON_CAMPUS',
        mode: 'OFFLINE',
        location: 'Campus Auditorium',
        startDate: '2026-04-15',
        endDate: '2026-04-20',
        registrationDeadline: '2026-04-10',
        eligibilityCriteria: {
          minCgpa: 7.5,
          allowedBranches: ['CSE', 'IT', 'ECE'],
          allowedYears: [3, 4],
          backlogsAllowed: false
        },
        positions: [{ title: 'SDE', package: 2500000, openings: 10, location: 'Bangalore' }],
        status: 'ACTIVE',
        registeredStudents: 245,
        selectedStudents: 0,
        createdAt: '',
        updatedAt: ''
      },
      {
        id: 2,
        title: 'Summer Internship Program',
        companyName: 'Microsoft',
        companyId: 2,
        description: 'Summer internship opportunity for pre-final year students. Duration: 2 months.',
        driveType: 'ON_CAMPUS',
        mode: 'HYBRID',
        location: 'Virtual + Campus',
        startDate: '2026-05-01',
        endDate: '2026-05-10',
        registrationDeadline: '2026-04-25',
        eligibilityCriteria: {
          minCgpa: 7.0,
          allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
          allowedYears: [3],
          backlogsAllowed: true
        },
        positions: [{ title: 'Intern', package: 800000, openings: 20, location: 'Hyderabad' }],
        status: 'UPCOMING',
        registeredStudents: 0,
        selectedStudents: 0,
        createdAt: '',
        updatedAt: ''
      },
      {
        id: 3,
        title: 'Virtual Hiring Drive',
        companyName: 'Amazon',
        companyId: 3,
        description: 'Hiring for multiple roles including SDE, Frontend, and DevOps.',
        driveType: 'VIRTUAL',
        mode: 'ONLINE',
        location: 'Virtual',
        startDate: '2026-03-20',
        endDate: '2026-03-25',
        registrationDeadline: '2026-03-15',
        eligibilityCriteria: {
          minCgpa: 7.0,
          allowedBranches: ['CSE', 'IT'],
          allowedYears: [4],
          backlogsAllowed: false
        },
        positions: [
          { title: 'SDE', package: 1800000, openings: 15, location: 'Bangalore' },
          { title: 'Frontend', package: 1600000, openings: 8, location: 'Bangalore' }
        ],
        status: 'COMPLETED',
        registeredStudents: 180,
        selectedStudents: 23,
        createdAt: '',
        updatedAt: ''
      },
      {
        id: 4,
        title: 'Off Campus Hiring Sprint 2026',
        companyName: 'Infosys',
        companyId: 4,
        description: 'Mass hiring drive for software engineer and systems engineer roles across multiple locations.',
        driveType: 'OFF_CAMPUS',
        mode: 'ONLINE',
        location: 'Online Assessment Portal',
        startDate: '2026-06-12',
        endDate: '2026-06-18',
        registrationDeadline: '2026-06-05',
        eligibilityCriteria: {
          minCgpa: 6.5,
          allowedBranches: ['CSE', 'IT', 'ECE', 'EEE', 'MECH'],
          allowedYears: [4],
          backlogsAllowed: true
        },
        positions: [
          { title: 'Systems Engineer', package: 650000, openings: 40, location: 'Pune' }
        ],
        status: 'UPCOMING',
        registeredStudents: 96,
        selectedStudents: 0,
        createdAt: '',
        updatedAt: ''
      },
      {
        id: 5,
        title: 'Product Engineering Drive 2026',
        companyName: 'Adobe',
        companyId: 5,
        description: 'Product engineering and frontend roles for students with strong DSA, web, and problem-solving skills.',
        driveType: 'ON_CAMPUS',
        mode: 'HYBRID',
        location: 'Seminar Hall + Online Interview',
        startDate: '2026-07-08',
        endDate: '2026-07-12',
        registrationDeadline: '2026-07-01',
        eligibilityCriteria: {
          minCgpa: 7.8,
          allowedBranches: ['CSE', 'IT', 'ECE'],
          allowedYears: [4],
          backlogsAllowed: false
        },
        positions: [
          { title: 'Product Engineer', package: 2200000, openings: 6, location: 'Noida' },
          { title: 'Frontend Engineer', package: 2000000, openings: 4, location: 'Bangalore' }
        ],
        status: 'ACTIVE',
        registeredStudents: 132,
        selectedStudents: 0,
        createdAt: '',
        updatedAt: ''
      }
    ];
  }
}
