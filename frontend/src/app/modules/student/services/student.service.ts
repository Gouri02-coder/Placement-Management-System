import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, Education, Project } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient) {}

  getStudentProfile(studentId: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${studentId}`);
  }

  updateStudentProfile(studentId: string, profile: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${studentId}`, profile);
  }

  addEducation(studentId: string, education: Education): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/${studentId}/education`, education);
  }

  addProject(studentId: string, project: Project): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/${studentId}/projects`, project);
  }

  uploadResume(studentId: string, resumeFile: File): Observable<{resumeUrl: string}> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    return this.http.post<{resumeUrl: string}>(`${this.apiUrl}/${studentId}/resume`, formData);
  }
}