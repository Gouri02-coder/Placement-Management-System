import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplicationFilter, ApplicationStatusUpdate } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api/applications';

  constructor(private http: HttpClient) {}

  getApplicationsByCompany(companyId: string, filters?: ApplicationFilter): Observable<Application[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ApplicationFilter];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params = params.append(key, item.toString()));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }
    return this.http.get<Application[]>(`${this.apiUrl}/company/${companyId}`, { params });
  }

  getApplicationsByJob(jobId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/job/${jobId}`);
  }

  getApplicationById(applicationId: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${applicationId}`);
  }

  updateApplicationStatus(update: ApplicationStatusUpdate): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${update.applicationId}/status`, {
      status: update.status,
      notes: update.notes
    });
  }

  bulkUpdateApplicationStatus(applicationIds: string[], status: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-status`, { applicationIds, status });
  }

  downloadApplicationsExcel(companyId: string, filters?: ApplicationFilter): Observable<Blob> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ApplicationFilter];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get(`${this.apiUrl}/company/${companyId}/export/excel`, { 
      params, 
      responseType: 'blob' 
    });
  }

  downloadApplicationsPDF(companyId: string, filters?: ApplicationFilter): Observable<Blob> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ApplicationFilter];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get(`${this.apiUrl}/company/${companyId}/export/pdf`, { 
      params, 
      responseType: 'blob' 
    });
  }
}