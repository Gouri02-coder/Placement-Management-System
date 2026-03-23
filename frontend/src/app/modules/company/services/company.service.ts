import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CompanyStatistics } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:3000/api/companies';

  constructor(private http: HttpClient) {}

  getCompanyProfile(companyId: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${companyId}`);
  }

  updateCompanyProfile(companyId: string, profile: Partial<Company>): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${companyId}`, profile);
  }

  getCompanyStats(companyId: string): Observable<CompanyStatistics> {
    return this.http.get<CompanyStatistics>(`${this.apiUrl}/${companyId}/stats`);
  }

  uploadLogo(companyId: string, logoFile: File): Observable<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('logo', logoFile);
    return this.http.post<{ logoUrl: string }>(`${this.apiUrl}/${companyId}/logo`, formData);
  }

  getVerificationStatus(companyId: string): Observable<{ status: string; notes?: string }> {
    return this.http.get<{ status: string; notes?: string }>(`${this.apiUrl}/${companyId}/verification`);
  }

  getVerificationDocuments(companyId: string): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/${companyId}/verification-documents`);
  }

  getChangesHistory(companyId: string): Observable<{ changes: string[]; timestamps: Date[] }> {
    return this.http.get<{ changes: string[]; timestamps: Date[] }>(`${this.apiUrl}/${companyId}/changes-history`);
  }

  getexportData(companyId: string): Observable<{ csvUrl: string; jsonUrl: string }> {
    return this.http.get<{ csvUrl: string; jsonUrl: string }>(`${this.apiUrl}/${companyId}/export-data`);
  }

  getexportProfile(companyId: string): Observable<{ csvUrl: string; jsonUrl: string }> {
    return this.http.get<{ csvUrl: string; jsonUrl: string }>(`${this.apiUrl}/${companyId}/export-profile`);
  }
}