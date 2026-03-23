import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobCreateRequest } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:3000/api/jobs';

  constructor(private http: HttpClient) {}

  getJobsByCompany(companyId: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/company/${companyId}`);
  }

  getJobById(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${jobId}`);
  }

  createJob(jobData: JobCreateRequest): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, jobData);
  }

  updateJob(jobId: string, jobData: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${jobId}`, jobData);
  }

  deleteJob(jobId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${jobId}`);
  }

  closeJob(jobId: string): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/${jobId}/close`, {});
  }

  extendDeadline(jobId: string, newDeadline: Date): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/${jobId}/deadline`, { newDeadline });
  }
}