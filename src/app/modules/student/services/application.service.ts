import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api/applications';

  constructor(private http: HttpClient) {}

  applyForJob(studentId: number, applicationData: {
  jobId: string;
  studentId: string;
  coverLetter?: string;
  resumeUrl: string;
}): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, applicationData);
  }

  getStudentApplications(studentId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getApplicationStatus(applicationId: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${applicationId}`);
  }

  withdrawApplication(applicationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${applicationId}`);
  }
}