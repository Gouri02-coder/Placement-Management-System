import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { PTOCompanyService, Company, CompanyResponse } from '../../../../core/services/pto-company.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  totalCompanies = 0;
  approved = 0;
  pendingReview = 0;
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
    private ptoCompanyService: PTOCompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkDebugInfo();
    this.fetchCompanies();
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

  fetchCompanies(): void {
    this.loading = true;
    this.error = '';
    this.debugData.apiStatus = '';
    
    const token = this.tokenService.getToken();
    console.log('=== FETCH COMPANIES ===');
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
    
    this.ptoCompanyService.getCompanies().subscribe({
      next: (response: CompanyResponse) => {
        console.log('API Response:', response);
        this.debugData.apiStatus = 'success';
        
        if (response.status === 'success') {
          this.companies = response.companies || [];
          this.totalCompanies = response.total || this.companies.length;
          this.approved = response.approved || this.companies.filter(c => c.verified === true || c.approved === true).length;
          this.pendingReview = response.pending || this.companies.filter(c => c.verified !== true && c.approved !== true).length;
          
          this.filteredCompanies = [...this.companies];
          this.updatePagination();
        } else {
          this.error = (response as any).message || 'Failed to load companies';
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
          this.error = `You don't have permission to view companies. Your role: ${this.debugData.userRole || 'unknown'}`;
        } else if (error.status === 0) {
          this.error = 'Cannot connect to server. Please check if backend is running on port 8080.';
        } else {
          this.error = error.error?.message || error.message || 'Failed to load companies';
        }
        this.loading = false;
      }
    });
  }

  updateStats(): void {
    this.totalCompanies = this.companies.length;
    this.approved = this.companies.filter(c => c.verified === true || c.approved === true).length;
    this.pendingReview = this.companies.filter(c => c.verified !== true && c.approved !== true).length;
  }

  filterCompanies(): void {
    let filtered = [...this.companies];
    
    if (this.selectedFilter === 'approved') {
      filtered = filtered.filter(c => c.verified === true || c.approved === true);
    } else if (this.selectedFilter === 'pending') {
      filtered = filtered.filter(c => c.verified !== true && c.approved !== true);
    }
    
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.companyName?.toLowerCase().includes(search) ||
        c.name?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search) ||
        c.id?.toString().includes(search) ||
        c.industry?.toLowerCase().includes(search)
      );
    }
    
    this.filteredCompanies = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCompanies.length / this.itemsPerPage);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
  }

  get paginatedCompanies(): Company[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCompanies.slice(start, end);
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
    this.fetchCompanies();
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
    
    this.ptoCompanyService.getCompanies().subscribe({
      next: (response) => {
        this.debugInfo += `\n✅ API Success: Found ${response.total || response.companies?.length || 0} companies`;
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

  approveCompany(company: Company): void {
    if (confirm(`Approve company "${company.companyName || company.name}"?`)) {
      console.log('Approving company:', company.id, company.companyName);
      
      this.ptoCompanyService.approveCompany(company.id).subscribe({
        next: (response: any) => {
          console.log('Approve response:', response);
          if (response.status === 'success') {
            const index = this.companies.findIndex(c => c.id === company.id);
            if (index !== -1) {
              this.companies[index].verified = true;
              this.companies[index].approved = true;
            }
            this.updateStats();
            this.filterCompanies();
            alert(`✅ Company ${company.companyName || company.name} approved successfully!`);
            
            setTimeout(() => {
              this.fetchCompanies();
            }, 500);
          } else {
            alert(response.message || 'Failed to approve company');
          }
        },
        error: (error) => {
          console.error('Error approving company:', error);
          let errorMsg = 'Failed to approve company';
          if (error.status === 403) {
            errorMsg = `You don't have permission to approve companies. Your role: ${this.debugData.userRole}`;
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

  rejectCompany(company: Company): void {
    const reason = prompt(`Enter reason for rejecting "${company.companyName || company.name}":`, 'Incomplete registration details');
    if (reason !== null) {
      console.log('Rejecting company:', company.id, company.companyName);
      
      this.ptoCompanyService.rejectCompany(company.id, reason || undefined).subscribe({
        next: (response: any) => {
          console.log('Reject response:', response);
          if (response.status === 'success') {
            const index = this.companies.findIndex(c => c.id === company.id);
            if (index !== -1) {
              this.companies.splice(index, 1);
            }
            this.updateStats();
            this.filterCompanies();
            alert(`✅ Company ${company.companyName || company.name} rejected successfully!`);
            
            setTimeout(() => {
              this.fetchCompanies();
            }, 500);
          } else {
            alert(response.message || 'Failed to reject company');
          }
        },
        error: (error) => {
          console.error('Error rejecting company:', error);
          let errorMsg = 'Failed to reject company';
          if (error.status === 403) {
            errorMsg = `You don't have permission to reject companies. Your role: ${this.debugData.userRole}`;
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

  viewCompanyDetails(companyId: number): void {
    this.router.navigate(['/pto/company-management/company-details', companyId]);
  }
}