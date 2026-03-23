import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

import { StudentProfile } from '../../models/student.model';
import { StudentMonitorService } from '../../services/student-monitor.service';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly studentMonitorService = inject(StudentMonitorService);

  student: StudentProfile | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParamMap.get('id');

    if (!studentId) {
      this.errorMessage = 'Select a student from the list to view detailed data.';
      this.isLoading = false;
      return;
    }

    this.studentMonitorService.getStudentProfile(studentId).subscribe({
      next: (student) => {
        this.student = student;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading student details:', error);
        this.errorMessage = 'Unable to load this student record from the database.';
        this.isLoading = false;
      }
    });
  }
}