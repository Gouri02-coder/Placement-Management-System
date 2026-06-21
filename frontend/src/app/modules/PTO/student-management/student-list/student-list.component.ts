import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { PTOStudentService, Student, StudentResponse } from '../../../../core/services/pto-student.service';
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
  students: Student[] = [];
  filteredStudents: Student[] = [];
  totalStudents = 0;
  approved = 0;
  pendingReview = 0;
  rejectedStudents = 0;
  loading = false;
  error = '';
  debugInfo = '';
  searchTerm = '';
  selectedFilter = 'all';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  debugData = {
    tokenExists: false,
    tokenValid: false,
    tokenParts: 0,
    userRole: null as string | null,
    apiStatus: ''
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tokenService: TokenService,
    private ptoStudentService: PTOStudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkDebugInfo();
    this.fetchStudents();
  }

  checkDebugInfo(): void {
    const token = this.tokenService.getToken();
    this.debugData.tokenExists = !!token;
    
    if (token) {
      this.debugData.tokenValid = this.tokenService.isValidJwtToken(token);
      this.debugData.tokenParts = token.split('.').length;
      
      try {
        const decoded = this.tokenService.decodeToken(token);
        if (decoded) {
          this.debugData.userRole = decoded.role || this.authService.getUserRole();
        }
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    } else {
      this.debugData.userRole = this.authService.getUserRole();
    }
    
    console.log('Debug Info:', this.debugData);
  }

  fetchStudents(): void {
    this.loading = true;
    this.error = '';
    this.debugData.apiStatus = '';
    
    const token = this.tokenService.getToken();
    console.log('=== FETCH STUDENTS ===');
    console.log('Token exists:', !!token);
    
    if (!token) {
      console.error('No token found! Redirecting to login...');
      this.error = 'Session expired. Please login again.';
      this.loading = false;
      setTimeout(() => {
        this.authService.logout();
      }, 2000);
      return;
    }
    
    this.ptoStudentService.getStudents().subscribe({
      next: (response: StudentResponse) => {
        console.log('API Response:', response);
        this.debugData.apiStatus = 'success';
        
        // Handle the response based on your backend structure
        if (response.status === 'success') {
          this.students = response.students || [];
          this.totalStudents = response.total || this.students.length;
          this.approved = response.approved ?? this.students.filter(s => this.isApproved(s)).length;
          this.pendingReview = response.pending ?? this.students.filter(s => this.isPending(s)).length;
          this.rejectedStudents = response.rejected ?? this.students.filter(s => this.isRejected(s)).length;
          
          this.filteredStudents = [...this.students];
          this.updatePagination();
        } else {
          // Fixed: Access message from response correctly
          this.error = (response as any).message || 'Failed to load students';
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.debugData.apiStatus = `error: ${error.status}`;
        
        if (error.status === 401) {
          this.error = 'Session expired. Please login again.';
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        } else if (error.status === 403) {
          this.error = `You don't have permission to view students. Your role: ${this.debugData.userRole || 'unknown'}`;
        } else if (error.status === 0) {
          this.error = 'Cannot connect to server. Please check if backend is running on port 8080.';
        } else {
          this.error = error.error?.message || error.message || 'Failed to load students';
        }
        this.loading = false;
      }
    });
  }

  updateStats(): void {
    this.totalStudents = this.students.length;
    this.approved = this.students.filter(s => this.isApproved(s)).length;
    this.pendingReview = this.students.filter(s => this.isPending(s)).length;
    this.rejectedStudents = this.students.filter(s => this.isRejected(s)).length;
  }

  filterStudents(): void {
    let filtered = [...this.students];
    
    if (this.selectedFilter === 'approved') {
      filtered = filtered.filter(s => this.isApproved(s));
    } else if (this.selectedFilter === 'pending') {
      filtered = filtered.filter(s => this.isPending(s));
    } else if (this.selectedFilter === 'rejected') {
      filtered = filtered.filter(s => this.isRejected(s));
    }
    
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search) ||
        s.id?.toString().includes(search) ||
        s.department?.toLowerCase().includes(search) ||
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

  get paginatedStudents(): Student[] {
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
    this.checkDebugInfo();
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

=== USER DEBUG ===
User exists: ${!!user}
User email: ${user?.email || 'null'}
User role: ${user?.role || 'null'}

=== DEBUG DATA ===
User role from token: ${this.debugData.userRole}
API Status: ${this.debugData.apiStatus}
    `;
    
    if (token && this.tokenService.isValidJwtToken(token)) {
      try {
        const decoded = this.tokenService.decodeToken(token);
        this.debugInfo += `\n\n=== DECODED TOKEN ===\n${JSON.stringify(decoded, null, 2)}`;
      } catch (e) {
        this.debugInfo += `\n\n=== DECODED TOKEN ERROR ===\n${e}`;
      }
    }
    
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
      try {
        const decoded = this.tokenService.decodeToken(token);
        this.debugInfo += `User role: ${decoded?.role || 'unknown'}\n`;
      } catch (e) {
        this.debugInfo += `Error decoding token: ${e}\n`;
      }
    }
    
    this.ptoStudentService.getStudents().subscribe({
      next: (response) => {
        this.debugInfo += `\n✅ API Success: Found ${response.total || response.students?.length || 0} students`;
        setTimeout(() => {
          this.debugInfo = '';
        }, 5000);
      },
      error: (error) => {
        this.debugInfo += `\n❌ API Error: ${error.status} - ${error.message}`;
        setTimeout(() => {
          this.debugInfo = '';
        }, 5000);
      }
    });
  }

  approveStudent(student: Student): void {
    if (confirm(`Approve student ${student.name}?`)) {
      console.log('Approving student:', student.id, student.name);
      
      this.ptoStudentService.approveStudent(student.id).subscribe({
        next: (response: any) => {
          console.log('Approve response:', response);
          if (response.status === 'success') {
            // Update local data immediately
            const index = this.students.findIndex(s => s.id === student.id);
            if (index !== -1) {
              this.students[index].verified = true;
              this.students[index].approved = true;
              this.students[index].rejected = false;
              this.students[index].rejectionReason = undefined;
            }
            this.updateStats();
            this.filterStudents();
            alert(`✅ Student ${student.name} approved successfully!`);
            
          } else {
            alert(response.message || 'Failed to approve student');
          }
        },
        error: (error) => {
          console.error('Error approving student:', error);
          let errorMsg = 'Failed to approve student';
          if (error.status === 403) {
            errorMsg = `You don't have permission to approve students. Your role: ${this.debugData.userRole}`;
          } else if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          }
          alert(`❌ ${errorMsg}`);
        }
      });
    }
  }

  rejectStudent(student: Student): void {
    const reason = prompt(`Enter reason for rejecting ${student.name}:`, student.rejectionReason || 'Not selected by the Placement Office');
    if (reason !== null) {
      console.log('Rejecting student:', student.id, student.name);
      
      this.ptoStudentService.rejectStudent(student.id, reason || undefined).subscribe({
        next: (response: any) => {
          console.log('Reject response:', response);
          if (response.status === 'success') {
            // Update local data immediately
            const index = this.students.findIndex(s => s.id === student.id);
            if (index !== -1) {
              this.students[index].verified = false;
              this.students[index].approved = false;
              this.students[index].rejected = true;
              this.students[index].rejectionReason = reason || undefined;
            }
            this.updateStats();
            this.filterStudents();
            alert(`✅ Student ${student.name} rejected successfully!`);
            
          } else {
            alert(response.message || 'Failed to reject student');
          }
        },
        error: (error) => {
          console.error('Error rejecting student:', error);
          let errorMsg = 'Failed to reject student';
          if (error.status === 403) {
            errorMsg = `You don't have permission to reject students. Your role: ${this.debugData.userRole}`;
          } else if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          }
          alert(`❌ ${errorMsg}`);
        }
      });
    }
  }

  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/pto/student-management/student-details', studentId]);
  }

  getStudentStatus(student: Student): 'Approved' | 'Rejected' | 'Pending' {
    if (this.isApproved(student)) {
      return 'Approved';
    }

    if (this.isRejected(student)) {
      return 'Rejected';
    }

    return 'Pending';
  }

  getStudentStatusClass(student: Student): 'approved' | 'rejected' | 'pending' {
    if (this.isApproved(student)) {
      return 'approved';
    }

    if (this.isRejected(student)) {
      return 'rejected';
    }

    return 'pending';
  }

  canApprove(student: Student): boolean {
    return !this.isApproved(student);
  }

  canReject(student: Student): boolean {
    return !this.isRejected(student) && !this.isApproved(student);
  }

  private isApproved(student: Student): boolean {
    return student.verified === true || student.approved === true;
  }

  private isRejected(student: Student): boolean {
    return student.rejected === true;
  }

  private isPending(student: Student): boolean {
    return !this.isApproved(student) && !this.isRejected(student);
  }
}
