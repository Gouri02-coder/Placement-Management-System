import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentDashboard } from './components/student/student-dashboard/student-dashboard';
import { StudentDetails } from './components/student/student-details/student-details';
import { StudentList } from './components/student/student-list/student-list';
import { StudentForm } from './components/student/student-form/student-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,StudentDashboard,StudentDetails,StudentList,StudentForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
