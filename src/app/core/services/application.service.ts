import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  // Matches backend: POST /api/applications/apply?studentId=1&jobId=2
  applyForJob(studentId: number, jobId: number): Observable<Application> {
    const params = new HttpParams()
      .set('studentId', studentId.toString())
      .set('jobId', jobId.toString());
      
    // Sending null for the body because we are using RequestParams
    return this.http.post<Application>(`${this.apiUrl}/apply`, null, { params });
  }

  getStudentApplications(studentId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getJobApplications(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/job/${jobId}`);
  }
}