import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyticsData {
  totalJobs: number;
  totalApplications: number;
  applicationTrends: { date: string; count: number }[];
  branchWiseApplications: { branch: string; count: number }[];
  statusWiseApplications: { status: string; count: number }[];
  skillWiseAnalysis: { skill: string; count: number }[];
  hireRate: number;
  averageTimeToHire: number;
}

export interface ReportRequest {
  companyId: string;
  reportType: 'applications' | 'drives' | 'hiring' | 'comprehensive';
  startDate?: Date;
  endDate?: Date;
  format: 'pdf' | 'excel';
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/analytics';

  constructor(private http: HttpClient) {}

  getCompanyAnalytics(companyId: string, period?: string): Observable<AnalyticsData> {
    let params = new HttpParams();
    if (period) {
      params = params.set('period', period);
    }
    return this.http.get<AnalyticsData>(`${this.apiUrl}/company/${companyId}`, { params });
  }

  getJobAnalytics(jobId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/job/${jobId}`);
  }

  generateReport(request: ReportRequest): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/reports`, request, { 
      responseType: 'blob' 
    });
  }

  getDriveAnalytics(driveId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/drive/${driveId}`);
  }
}