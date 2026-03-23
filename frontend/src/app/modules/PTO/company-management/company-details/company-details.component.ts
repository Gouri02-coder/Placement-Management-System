import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CompanyProfile } from '../../models/company.model';
import { CompanyMonitorService } from '../../services/company-monitor.service';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css'
})
export class CompanyDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly companyMonitorService = inject(CompanyMonitorService);

  company: CompanyProfile | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const companyId = this.route.snapshot.queryParamMap.get('id');

    if (!companyId) {
      this.errorMessage = 'Select a company from the list to view details.';
      this.isLoading = false;
      return;
    }

    this.companyMonitorService.getCompanyProfile(companyId).subscribe({
      next: (company) => {
        this.company = company;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading company details:', error);
        this.errorMessage = 'Unable to load this company record from the database.';
        this.isLoading = false;
      }
    });
  }
}
