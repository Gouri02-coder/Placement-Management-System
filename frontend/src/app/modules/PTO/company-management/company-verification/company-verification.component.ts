import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CompanyProfile } from '../../models/company.model';
import { CompanyMonitorService } from '../../services/company-monitor.service';

@Component({
  selector: 'app-company-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-verification.component.html',
  styleUrl: './company-verification.component.css'
})
export class CompanyVerificationComponent implements OnInit {
  private readonly companyMonitorService = inject(CompanyMonitorService);

  companies: CompanyProfile[] = [];
  remarks: Record<string, string> = {};
  isLoading = true;
  errorMessage = '';
  activeCompanyId = '';

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.companyMonitorService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies.map((company) => ({
          ...company,
          contactName: company.name,
          contactRole: 'Recruiter',
          contactEmail: '',
          campusCoordinator: 'PTO',
          description: ''
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading company verification queue:', error);
        this.errorMessage = 'Unable to load company verification queue from the database.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(companyId: string, status: 'APPROVED' | 'REJECTED'): void {
    this.activeCompanyId = companyId;

    this.companyMonitorService
      .updateCompanyVerification(companyId, status, this.remarks[companyId] || '')
      .subscribe({
        next: (updatedCompany) => {
          this.companies = this.companies.map((company) =>
            company.id === companyId ? updatedCompany : company
          );
          this.activeCompanyId = '';
        },
        error: (error) => {
          console.error('Error updating company verification:', error);
          this.errorMessage = 'Unable to update company verification status.';
          this.activeCompanyId = '';
        }
      });
  }

  get pendingCount(): number {
    return this.companies.filter((company) => company.status === 'Pending').length;
  }
}
