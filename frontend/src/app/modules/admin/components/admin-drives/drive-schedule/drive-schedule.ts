import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DriveForm {
  company: string;
  role: string;
  date: string;
  venue: string;
  slots: number;
}

interface ScheduledDrive extends DriveForm {
  id: string;
  status: 'Scheduled' | 'Published' | 'Cancelled';
}

@Component({
  selector: 'app-drive-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drive-schedule.html',
  styleUrl: './drive-schedule.css'
})
export class DriveSchedule {
  form: DriveForm = {
    company: '',
    role: '',
    date: '',
    venue: '',
    slots: 20
  };

  scheduledDrives: ScheduledDrive[] = [
    {
      id: 'DRV-301',
      company: 'Nexora Labs',
      role: 'Frontend Engineer',
      date: '2026-03-18',
      venue: 'Auditorium A',
      slots: 40,
      status: 'Published'
    },
    {
      id: 'DRV-302',
      company: 'CoreMatrix',
      role: 'Embedded Trainee',
      date: '2026-03-22',
      venue: 'Seminar Hall 2',
      slots: 28,
      status: 'Scheduled'
    }
  ];

  addDrive(): void {
    if (!this.form.company || !this.form.role || !this.form.date || !this.form.venue || this.form.slots <= 0) {
      return;
    }

    this.scheduledDrives.unshift({
      id: `DRV-${Math.floor(Math.random() * 900 + 100)}`,
      ...this.form,
      status: 'Scheduled'
    });

    this.form = {
      company: '',
      role: '',
      date: '',
      venue: '',
      slots: 20
    };
  }

  publish(drive: ScheduledDrive): void {
    drive.status = 'Published';
  }

  cancel(drive: ScheduledDrive): void {
    drive.status = 'Cancelled';
  }
}
