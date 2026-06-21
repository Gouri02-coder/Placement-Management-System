import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from './token.service';

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  course: string;
  year: number;
  cgpa: number;
  parentEmail: string;
  verified: boolean;
  approved: boolean;
  rejected: boolean;
  rejectionReason?: string;
  createdDate?: string;
}

export interface StudentResponse {
  status: string;
  students: Student[];
  total: number;
  approved?: number;
  pending?: number;
  rejected?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PTOStudentService {
  private apiUrl = 'http://localhost:8080/api/pto';

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

  getStudents(): Observable<StudentResponse> {
    console.log('Fetching students from:', `${this.apiUrl}/students`);
    const headers = this.getHeaders();
    
    return this.http.get<StudentResponse>(`${this.apiUrl}/students`, { headers })
      .pipe(
        map(response => this.normalizeStudentResponse(response)),
        tap(response => {
          console.log('Students fetched successfully:', response);
        }),
        catchError(error => {
          console.error('Error fetching students:', error);
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

  getPendingStudents(): Observable<StudentResponse> {
    console.log('Fetching pending students from:', `${this.apiUrl}/students/pending`);
    const headers = this.getHeaders();
    
    return this.http.get<StudentResponse>(`${this.apiUrl}/students/pending`, { headers })
      .pipe(
        map(response => this.normalizeStudentResponse(response)),
        tap(response => {
          console.log('Pending students fetched:', response);
        }),
        catchError(error => {
          console.error('Error fetching pending students:', error);
          return throwError(() => error);
        })
      );
  }

  getVerifiedStudents(): Observable<StudentResponse> {
    console.log('Fetching verified students from:', `${this.apiUrl}/students/verified`);
    const headers = this.getHeaders();
    
    return this.http.get<StudentResponse>(`${this.apiUrl}/students/verified`, { headers })
      .pipe(
        map(response => this.normalizeStudentResponse(response)),
        tap(response => {
          console.log('Verified students fetched:', response);
        }),
        catchError(error => {
          console.error('Error fetching verified students:', error);
          return throwError(() => error);
        })
      );
  }

  approveStudent(id: number): Observable<any> {
    console.log(`Approving student with ID: ${id}`);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/students/${id}/approve`;
    
    console.log('Approve URL:', url);
    console.log('Headers:', headers);
    
    return this.http.put(url, {}, { headers })
      .pipe(
        tap(response => {
          console.log('Approve response:', response);
        }),
        catchError(error => {
          console.error('Error approving student:', error);
          console.error('Error status:', error.status);
          console.error('Error details:', error.error);
          return throwError(() => error);
        })
      );
  }

  rejectStudent(id: number, reason?: string): Observable<any> {
    console.log(`Rejecting student with ID: ${id}`);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/students/${id}/reject`;
    
    console.log('Reject URL:', url);
    console.log('Headers:', headers);
    
    const body = reason ? { reason } : {};

    return this.http.put(url, body, { headers })
      .pipe(
        tap(response => {
          console.log('Reject response:', response);
        }),
        catchError(error => {
          console.error('Error rejecting student:', error);
          console.error('Error status:', error.status);
          console.error('Error details:', error.error);
          return throwError(() => error);
        })
      );
  }

  getStudentById(id: number): Observable<any> {
    console.log(`Fetching student with ID: ${id}`);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/students/${id}`;
    
    return this.http.get(url, { headers })
      .pipe(
        tap(response => {
          console.log('Student fetched:', response);
        }),
        catchError(error => {
          console.error('Error fetching student:', error);
          return throwError(() => error);
        })
      );
  }

  testEndpoint(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/test-endpoint`, { headers })
      .pipe(
        tap(response => console.log('Test endpoint response:', response)),
        catchError(error => {
          console.error('Test endpoint error:', error);
          return throwError(() => error);
        })
      );
  }

  debugAuth(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/debug-auth`, { headers })
      .pipe(
        tap(response => console.log('Debug auth response:', response)),
        catchError(error => {
          console.error('Debug auth error:', error);
          return throwError(() => error);
        })
      );
  }

  private normalizeStudentResponse(response: StudentResponse): StudentResponse {
    return {
      ...response,
      students: (response.students || []).map(student => ({
        ...student,
        verified: student.verified ?? (student as any).verifiedByAdmin ?? false,
        approved: student.approved ?? student.verified ?? (student as any).verifiedByAdmin ?? false,
        rejected: student.rejected ?? (student as any).rejectedByAdmin ?? false,
        rejectionReason: student.rejectionReason ?? (student as any).rejectionReason
      }))
    };
  }
}
