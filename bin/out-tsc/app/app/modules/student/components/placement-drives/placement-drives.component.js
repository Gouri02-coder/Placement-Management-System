import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
let PlacementDrivesComponent = class PlacementDrivesComponent {
    placementDrives = [
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
    ngOnInit() { }
    registerForDrive(driveId) {
        const drive = this.placementDrives.find(d => d.id === driveId);
        if (drive) {
            // Add student ID to registered students (in real app, use actual student ID)
            drive.registeredStudents.push('student123');
            alert('Successfully registered for the drive!');
        }
    }
    isRegistered(driveId) {
        const drive = this.placementDrives.find(d => d.id === driveId);
        return drive ? drive.registeredStudents.includes('student123') : false;
    }
    canRegister(drive) {
        return new Date() < drive.registrationDeadline;
    }
};
PlacementDrivesComponent = __decorate([
    Component({
        selector: 'app-placement-drives',
        standalone: true,
        imports: [CommonModule, RouterModule],
        templateUrl: './placement-drives.component.html',
        styleUrls: ['./placement-drives.component.css']
    })
], PlacementDrivesComponent);
export { PlacementDrivesComponent };
