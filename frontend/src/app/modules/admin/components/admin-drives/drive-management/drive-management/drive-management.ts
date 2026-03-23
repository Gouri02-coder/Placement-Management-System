import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface PlacementDrive {
  title: string;
  company: string;
  slots: number;
  placed: number;
  stage: 'Scheduled' | 'Running' | 'Closed';
}

@Component({
  selector: 'app-drive-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drive-management.html',
  styleUrl: './drive-management.css'
})
export class DriveManagement {
  drives: PlacementDrive[] = [
    { title: 'Full Stack Hiring Sprint', company: 'Nexora Labs', slots: 40, placed: 26, stage: 'Running' },
    { title: 'Embedded Engineer Drive', company: 'CoreMatrix', slots: 25, placed: 18, stage: 'Scheduled' },
    { title: 'Graduate Hiring Program', company: 'ByteWorks', slots: 60, placed: 60, stage: 'Closed' }
  ];

  getPlacementRatio(drive: PlacementDrive): number {
    if (!drive.slots) {
      return 0;
    }

    return Math.round((drive.placed / drive.slots) * 100);
  }
}
