import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; 
import { Job } from '../models/job.model'; 

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/jobs`;

  getRecommendedJobs(studentId: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/recommended/${studentId}`);
  }

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getActiveJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/active`);
  }

  getJobById(jobId: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${jobId}`);
  }

  getEligibleJobs(cgpa: number, department: string): Observable<Job[]> {
    let params = new HttpParams()
      .set('cgpa', cgpa.toString())
      .set('department', department);
      
    return this.http.get<Job[]>(`${this.apiUrl}/eligible`, { params });
  }

  searchJobsByCompany(companyName: string): Observable<Job[]> {
    let params = new HttpParams().set('companyName', companyName);
    return this.http.get<Job[]>(`${this.apiUrl}/search`, { params });
  }

  getJobsByLocation(location: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/location/${location}`);
  }
}