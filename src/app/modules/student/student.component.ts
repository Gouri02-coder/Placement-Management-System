import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StudentService } from './services/student.service';
import { Student } from './models/student.model';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  student: Student | null = null;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.id) {
      this.studentService.getStudentProfile(user.id.toString()).subscribe({
        next: (data) => (this.student = data),
        error: (err) => console.error('Layout profile load failed', err)
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}