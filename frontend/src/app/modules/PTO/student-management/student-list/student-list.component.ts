import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  totalStudents = 0;
  approved = 0;
  pendingReview = 0;
  loading = false;
  error = '';
  debugInfo = '';
  searchTerm = '';
  selectedFilter = 'all'; // all, approved, pending
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.loading = true;
    this.error = '';
    
    // Check token before making request
    const token = this.tokenService.getToken();
    console.log('=== FETCH STUDENTS ===');
    console.log('Token exists:', !!token);
    
    if (!token) {
      console.error('No token found! Redirecting to login...');
      this.error = 'Session expired. Please login again.';
      this.loading = false;
      this.authService.logout();
      return;
    }
    
    console.log('Token valid JWT format:', this.tokenService.isValidJwtToken(token));
    console.log('Token parts:', token.split('.').length);
    
    // Use the correct API endpoint based on your backend
    const apiUrl = 'http://localhost:8080/api/pto/students';
    
    console.log('Making API call to:', apiUrl);
    
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        
        // Handle the response based on your backend structure
        if (response.status === 'success') {
          // Backend returns students array
          this.students = response.students || [];
          this.totalStudents = response.total || this.students.length;
          this.approved = response.approved || this.students.filter(s => s.verified).length;
          this.pendingReview = response.pending || this.students.filter(s => !s.verified).length;
          
          this.filteredStudents = [...this.students];
          this.updatePagination();
        } else {
          this.error = response.message || 'Failed to load students';
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        if (error.status === 401) {
          console.error('Unauthorized - Token may be invalid or expired');
          this.error = 'Session expired. Please login again.';
          this.authService.logout();
        } else if (error.status === 403) {
          this.error = 'You don\'t have permission to view students. Please contact administrator.';
        } else if (error.status === 0) {
          this.error = 'Cannot connect to server. Please check if backend is running on port 8080.';
        } else {
          this.error = error.error?.message || 'Failed to load students';
        }
        this.loading = false;
      }
    });
  }

  updateStats(): void {
    this.totalStudents = this.students.length;
    this.approved = this.students.filter(s => s.verified === true || s.approved === true).length;
    this.pendingReview = this.students.filter(s => s.verified !== true && s.approved !== true).length;
  }

  filterStudents(): void {
    let filtered = [...this.students];
    
    // Apply status filter
    if (this.selectedFilter === 'approved') {
      filtered = filtered.filter(s => s.verified === true || s.approved === true);
    } else if (this.selectedFilter === 'pending') {
      filtered = filtered.filter(s => s.verified !== true && s.approved !== true);
    }
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search) ||
        s.id?.toString().includes(search) ||
        s.department?.toLowerCase().includes(search) ||
        s.rollNumber?.toLowerCase().includes(search) ||
        s.course?.toLowerCase().includes(search)
      );
    }
    
    this.filteredStudents = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
  }

  get paginatedStudents(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredStudents.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  refresh(): void {
    this.searchTerm = '';
    this.selectedFilter = 'all';
    this.currentPage = 1;
    this.fetchStudents();
  }

  debugToken(): void {
    const token = this.tokenService.getToken();
    const user = this.authService.getUser();
    
    this.debugInfo = `
=== TOKEN DEBUG ===
Token exists: ${!!token}
Token length: ${token?.length || 0}
Token parts: ${token?.split('.').length || 0}
Token valid JWT: ${this.tokenService.isValidJwtToken(token || '')}
Token preview: ${token?.substring(0, 50) || 'null'}...

=== USER DEBUG ===
User exists: ${!!user}
User email: ${user?.email || 'null'}
User role: ${user?.role || 'null'}
User id: ${user?.id || 'null'}

=== STORAGE DEBUG ===
localStorage keys: ${Object.keys(localStorage).join(', ')}
    `;
    
    if (token && this.tokenService.isValidJwtToken(token)) {
      const decoded = this.tokenService.decodeToken(token);
      this.debugInfo += `\n\n=== DECODED TOKEN ===\n${JSON.stringify(decoded, null, 2)}`;
    }
    
    // Auto hide after 10 seconds
    setTimeout(() => {
      this.debugInfo = '';
    }, 10000);
  }

  testApi(): void {
    const token = this.tokenService.getToken();
    this.debugInfo = `Testing API with token: ${!!token}\n`;
    
    if (token) {
      this.debugInfo += `Token valid: ${this.tokenService.isValidJwtToken(token)}\n`;
      this.debugInfo += `Token parts: ${token.split('.').length}\n`;
    }
    
    this.http.get('http://localhost:8080/api/pto/students').subscribe({
      next: (response) => {
        this.debugInfo += `\n✅ API Success: ${JSON.stringify(response, null, 2)}`;
        setTimeout(() => {
          this.debugInfo = '';
        }, 5000);
      },
      error: (error) => {
        this.debugInfo += `\n❌ API Error: ${error.status} - ${error.message}`;
        if (error.error) {
          this.debugInfo += `\nDetails: ${JSON.stringify(error.error)}`;
        }
        setTimeout(() => {
          this.debugInfo = '';
        }, 5000);
      }
    });
  }

  approveStudent(student: any): void {
    if (confirm(`Approve student ${student.name}?`)) {
      const apiUrl = `http://localhost:8080/api/pto/students/${student.id}/approve`;
      this.http.put(apiUrl, {}).subscribe({
        next: (response: any) => {
          console.log('Approve response:', response);
          if (response.status === 'success') {
            student.verified = true;
            student.approved = true;
            this.updateStats();
            this.filterStudents();
            alert('Student approved successfully!');
          } else {
            alert(response.message || 'Failed to approve student');
          }
        },
        error: (error) => {
          console.error('Error approving student:', error);
          alert(error.error?.message || 'Failed to approve student');
        }
      });
    }
  }

  rejectStudent(student: any): void {
    if (confirm(`Reject student ${student.name}?`)) {
      const apiUrl = `http://localhost:8080/api/pto/students/${student.id}/reject`;
      this.http.put(apiUrl, {}).subscribe({
        next: (response: any) => {
          console.log('Reject response:', response);
          if (response.status === 'success') {
            student.verified = false;
            student.approved = false;
            student.rejected = true;
            this.updateStats();
            this.filterStudents();
            alert('Student rejected');
          } else {
            alert(response.message || 'Failed to reject student');
          }
        },
        error: (error) => {
          console.error('Error rejecting student:', error);
          alert(error.error?.message || 'Failed to reject student');
        }
      });
    }
  }

  viewStudentDetails(studentId: string): void {
    this.router.navigate(['/pto/student-management/student-details', studentId]);
  }
}