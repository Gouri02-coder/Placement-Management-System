import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { Student, StudentProfile } from '../models';

interface StudentApiItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  course: string;
  year: number;
  cgpa: number;
  verificationStatus?: string;
  verificationRemarks?: string;
  verifiedByPto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentMonitorService {
  private readonly apiService = inject(ApiService);

  getStudents(): Observable<Student[]> {
    return this.apiService.get<StudentApiItem[]>('api/students').pipe(
      map((students) => students.map((student) => this.mapStudent(student)))
    );
  }

  getStudentProfile(studentId: string): Observable<StudentProfile> {
    return this.apiService.get<StudentApiItem>(`api/students/${studentId}`).pipe(
      map((student) => this.mapStudentProfile(student))
    );
  }

  updateStudentVerification(
    studentId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
    remarks: string,
    verifiedBy = 'PTO'
  ): Observable<StudentProfile> {
    return this.apiService
      .patch<StudentApiItem>(
        `api/students/${studentId}/verification?verifiedBy=${encodeURIComponent(verifiedBy)}`,
        {
          status,
          remarks
        }
      )
      .pipe(map((student) => this.mapStudentProfile(student)));
  }

  private mapStudent(student: StudentApiItem): Student {
    return {
      id: String(student.id),
      name: student.name,
      department: student.department,
      year: String(student.year),
      cgpa: student.cgpa,
      placementStatus: 'In Progress',
      verificationStatus: this.normalizeVerificationStatus(student.verificationStatus),
      email: student.email
    };
  }

  private mapStudentProfile(student: StudentApiItem): StudentProfile {
    return {
      ...this.mapStudent(student),
      phone: student.phone,
      skills: [],
      documentsPending: student.verificationStatus === 'APPROVED' ? 0 : 1,
      resumeScore: 80
    };
  }

  private normalizeVerificationStatus(status?: string): 'Pending' | 'Approved' | 'Needs Review' {
    if (status === 'APPROVED') {
      return 'Approved';
    }

    if (status === 'REJECTED') {
      return 'Needs Review';
    }

    return 'Pending';
  }
}

