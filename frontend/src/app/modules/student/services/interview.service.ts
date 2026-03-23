import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interview } from '../models/interview.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:3000/api/interviews';

  constructor(private http: HttpClient) {}

  getStudentInterviews(studentId: string): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getInterviewDetails(interviewId: string): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/${interviewId}`);
  }

  getUpcomingInterviews(studentId: string): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/student/${studentId}/upcoming`);
  }

  updateInterviewStatus(interviewId: string, status: string): Observable<Interview> {
    return this.http.patch<Interview>(`${this.apiUrl}/${interviewId}/status`, { status });
  }

  submitInterviewFeedback(interviewId: string, feedback: any): Observable<Interview> {
    return this.http.post<Interview>(`${this.apiUrl}/${interviewId}/feedback`, feedback);
  }

  rescheduleInterview(interviewId: string, newDate: Date): Observable<Interview> {
    return this.http.patch<Interview>(`${this.apiUrl}/${interviewId}/reschedule`, { 
      newDate: newDate.toISOString() 
    });
  }

  confirmInterviewAttendance(interviewId: string): Observable<Interview> {
    return this.http.patch<Interview>(`${this.apiUrl}/${interviewId}/confirm`, {});
  }

  cancelInterview(interviewId: string, reason: string): Observable<Interview> {
    return this.http.patch<Interview>(`${this.apiUrl}/${interviewId}/cancel`, { reason });
  }

  getInterviewPreparationMaterials(interviewId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${interviewId}/preparation`);
  }
}