import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from '../../../core/services/token.service';

export interface Position {
  title: string;
  package: number;
  openings: number;
  location: string;
}

export interface Drive {
  id: number;
  title: string;
  companyName: string;
  companyId: number;
  description: string;
  driveType: 'ON_CAMPUS' | 'OFF_CAMPUS' | 'VIRTUAL';
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  location: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  eligibilityCriteria: {
    minCgpa: number;
    allowedBranches: string[];
    allowedYears: number[];
    backlogsAllowed: boolean;
  };
  positions: Position[];
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  registeredStudents: number;
  selectedStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriveResponse {
  status: string;
  drives: Drive[];
  total: number;
  active: number;
  upcoming: number;
  completed: number;
}

@Injectable({
  providedIn: 'root'
})
export class PTODriveService {
  private apiUrl = 'http://localhost:8080/api/pto/drives';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => error);
  }

  getAllDrives(): Observable<DriveResponse> {
    console.log('Fetching all drives...');
    return this.http.get<DriveResponse>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Drives fetched:', response)),
        catchError(this.handleError)
      );
  }

  getDriveById(id: number): Observable<Drive> {
    return this.http.get<Drive>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createDrive(drive: Partial<Drive>): Observable<any> {
    return this.http.post(this.apiUrl, drive, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateDrive(id: number, drive: Partial<Drive>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, drive, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteDrive(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getDriveStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getRegisteredStudents(driveId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${driveId}/students`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}