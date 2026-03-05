import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface PlacementDrive {
  id: string;
  companyName: string;
  jobTitle: string;
  description: string;
  eligibility: {
    minCGPA: number;
    allowedBranches: string[];
    backlogAllowed: boolean;
  };
  package: string;
  location: string;
  driveDate: Date;
  registrationDeadline: Date;
  registeredStudents: string[];
}

@Component({
  selector: 'app-placement-drives',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './placement-drives.component.html',
  styleUrls: ['./placement-drives.component.css']
})
export class PlacementDrivesComponent implements OnInit {
  placementDrives: PlacementDrive[] = [
    {
      id: '1',
      companyName: 'Tech Corp',
      jobTitle: 'Software Engineer',
      description: 'Looking for talented software engineers',
      eligibility: {
        minCGPA: 7.5,
        allowedBranches: ['CSE', 'IT', 'ECE'],
        backlogAllowed: false
      },
      package: '12 LPA',
      location: 'Bangalore',
      driveDate: new Date('2024-02-15'),
      registrationDeadline: new Date('2024-02-10'),
      registeredStudents: []
    }
  ];

  ngOnInit(): void {}

  registerForDrive(driveId: string): void {
    const drive = this.placementDrives.find(d => d.id === driveId);
    if (drive) {
      // Add student ID to registered students (in real app, use actual student ID)
      drive.registeredStudents.push('student123');
      alert('Successfully registered for the drive!');
    }
  }

  isRegistered(driveId: string): boolean {
    const drive = this.placementDrives.find(d => d.id === driveId);
    return drive ? drive.registeredStudents.includes('student123') : false;
  }

  canRegister(drive: PlacementDrive): boolean {
    return new Date() < drive.registrationDeadline;
  }
}