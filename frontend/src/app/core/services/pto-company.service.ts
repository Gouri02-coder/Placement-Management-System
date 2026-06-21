import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from './token.service';

export interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  website: string;
  companySize: string;
  address: string;
  description: string;
  verified: boolean;
  approved: boolean;
  createdDate?: string;
  // Add these optional fields if they exist in your backend
  location?: string;
  city?: string;
  state?: string;
}
export interface CompanyResponse {
  status: string;
  companies: Company[];
  total: number;
  approved?: number;
  pending?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PTOCompanyService {
  private apiUrl = 'http://localhost:8080/api/companies';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    
    if (!token) {
      console.error('No token found in getHeaders()');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCompanies(): Observable<CompanyResponse> {
    console.log('Fetching companies from:', `${this.apiUrl}`);
    const headers = this.getHeaders();
    
    return this.http.get<CompanyResponse>(`${this.apiUrl}`, { headers })
      .pipe(
        tap(response => {
          console.log('Companies fetched successfully:', response);
        }),
        catchError(error => {
          console.error('Error fetching companies:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          
          if (error.status === 403) {
            const token = this.tokenService.getToken();
            if (token) {
              const decoded = this.tokenService.decodeToken(token);
              console.error('Current user role from token:', decoded?.role);
            }
          }
          
          return throwError(() => error);
        })
      );
  }

  getPendingCompanies(): Observable<CompanyResponse> {
    console.log('Fetching pending companies from:', `${this.apiUrl}/pending`);
    const headers = this.getHeaders();
    
    return this.http.get<CompanyResponse>(`${this.apiUrl}/pending`, { headers })
      .pipe(
        tap(response => {
          console.log('Pending companies fetched:', response);
        }),
        catchError(error => {
          console.error('Error fetching pending companies:', error);
          return throwError(() => error);
        })
      );
  }

  approveCompany(id: number): Observable<any> {
    console.log(`Approving company with ID: ${id}`);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${id}/approve`;
    
    console.log('Approve URL:', url);
    console.log('Headers:', headers);
    
    return this.http.put(url, {}, { headers })
      .pipe(
        tap(response => {
          console.log('Approve response:', response);
        }),
        catchError(error => {
          console.error('Error approving company:', error);
          console.error('Error status:', error.status);
          console.error('Error details:', error.error);
          return throwError(() => error);
        })
      );
  }

  rejectCompany(id: number, reason?: string): Observable<any> {
    console.log(`Rejecting company with ID: ${id}`);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${id}/reject`;
    const body = reason ? { reason } : {};
    
    console.log('Reject URL:', url);
    console.log('Headers:', headers);
    
    return this.http.put(url, body, { headers })
      .pipe(
        tap(response => {
          console.log('Reject response:', response);
        }),
        catchError(error => {
          console.error('Error rejecting company:', error);
          console.error('Error status:', error.status);
          console.error('Error details:', error.error);
          return throwError(() => error);
        })
      );
  }

  deleteCompany(id: number): Observable<any> {
    console.log(`Deleting company with ID: ${id}`);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${id}`;
    
    return this.http.delete(url, { headers })
      .pipe(
        tap(response => {
          console.log('Delete response:', response);
        }),
        catchError(error => {
          console.error('Error deleting company:', error);
          return throwError(() => error);
        })
      );
  }

  getCompanyById(id: number): Observable<any> {
    console.log(`Fetching company with ID: ${id}`);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${id}`;
    
    return this.http.get(url, { headers })
      .pipe(
        tap(response => {
          console.log('Company fetched:', response);
        }),
        catchError(error => {
          console.error('Error fetching company:', error);
          return throwError(() => error);
        })
      );
  }

  getCompanyStats(): Observable<any> {
    console.log('Fetching company stats from:', `${this.apiUrl}/stats`);
    const headers = this.getHeaders();
    
    return this.http.get(`${this.apiUrl}/stats`, { headers })
      .pipe(
        tap(response => {
          console.log('Company stats fetched:', response);
        }),
        catchError(error => {
          console.error('Error fetching company stats:', error);
          return throwError(() => error);
        })
      );
  }
}