import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  // Minimal stub service to satisfy DI and provide simple data accessors.
  getCurrentStudent(): Observable<Student | null> {
    return of(null);
  }

  // Add more stubs here as needed by components.
}
