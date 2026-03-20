import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  
  constructor() { }

  // Mock data for development
  getRoleDescriptions(): Observable<{value: string, label: string, description: string}[]> {
    const roles = [
      {
        value: 'student',
        label: 'Student',
        description: 'Apply for jobs and internships, track applications, and manage interviews'
      },
      {
        value: 'company', 
        label: 'Company',
        description: 'Post job opportunities, review applications, and schedule interviews'
      }
    ];
    
    return of(roles).pipe(delay(500));
  }

  // Mock validation for unique email
  checkEmailUnique(email: string): Observable<boolean> {
    // Simulate API call to check email availability
    const takenEmails = ['test@example.com', 'admin@college.edu', 'company@test.com'];
    const isUnique = !takenEmails.includes(email.toLowerCase());
    
    return of(isUnique).pipe(delay(800));
  }
}