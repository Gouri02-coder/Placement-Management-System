import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Company } from '../../models/company.model';
import { CompanyMonitorService } from '../../services/company-monitor.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit {
  private readonly companyMonitorService = inject(CompanyMonitorService);

  companies: Company[] = [];
  searchTerm = '';
  selectedStatus = 'All';
  isLoading = true;
  errorMessage = '';

  readonly statusOptions = ['All', 'Approved', 'Pending', 'Under Review', 'Needs Clarification'];

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.companyMonitorService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.errorMessage = 'Unable to load company records from the database right now.';
        this.isLoading = false;
      }
    });
  }

  get filteredCompanies(): Company[] {
    const normalizedTerm = this.searchTerm.trim().toLowerCase();

    return this.companies.filter((company) => {
      const matchesSearch =
        !normalizedTerm ||
        company.name.toLowerCase().includes(normalizedTerm) ||
        company.industry.toLowerCase().includes(normalizedTerm) ||
        company.location.toLowerCase().includes(normalizedTerm) ||
        company.id.toLowerCase().includes(normalizedTerm);

      const matchesStatus =
        this.selectedStatus === 'All' || company.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }
}
