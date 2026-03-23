import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { StudentProfile } from '../../models/student.model';
import { StudentMonitorService } from '../../services/student-monitor.service';

@Component({
  selector: 'app-student-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-verification.component.html',
  styleUrl: './student-verification.component.css'
})
export class StudentVerificationComponent implements OnInit {
  private readonly studentMonitorService = inject(StudentMonitorService);

  students: StudentProfile[] = [];
  remarks: Record<string, string> = {};
  isLoading = true;
  errorMessage = '';
  activeStudentId = '';

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentMonitorService.getStudents().subscribe({
      next: (students) => {
        this.students = students.map((student) => ({
          ...student,
          phone: '',
          skills: [],
          documentsPending: student.verificationStatus === 'Approved' ? 0 : 1,
          resumeScore: 80
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading verification queue:', error);
        this.errorMessage = 'Unable to load student verification queue from the database.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(studentId: string, status: 'APPROVED' | 'REJECTED'): void {
    this.activeStudentId = studentId;

    this.studentMonitorService
      .updateStudentVerification(studentId, status, this.remarks[studentId] || '')
      .subscribe({
        next: (updatedStudent) => {
          this.students = this.students.map((student) =>
            student.id === studentId ? updatedStudent : student
          );
          this.activeStudentId = '';
        },
        error: (error) => {
          console.error('Error updating student verification:', error);
          this.errorMessage = 'Unable to update student verification status.';
          this.activeStudentId = '';
        }
      });
  }

  get pendingCount(): number {
    return this.students.filter((student) => student.verificationStatus === 'Pending').length;
  }
}
