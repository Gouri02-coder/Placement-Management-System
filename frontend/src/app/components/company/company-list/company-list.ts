import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface CompanyItem {
  id: string;
  name: string;
  sector: string;
  openings: number;
  packageLpa: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css'
})
export class CompanyList {
  search = '';
  statusFilter: CompanyItem['status'] | 'All' = 'All';

  companies: CompanyItem[] = [
    { id: 'CMP-101', name: 'ApexNova Technologies', sector: 'Software', openings: 18, packageLpa: 7.5, status: 'Approved' },
    { id: 'CMP-102', name: 'BlueOrbit Analytics', sector: 'Analytics', openings: 10, packageLpa: 6.8, status: 'Pending' },
    { id: 'CMP-103', name: 'CoreGrid Manufacturing', sector: 'Manufacturing', openings: 6, packageLpa: 5.4, status: 'Rejected' }
  ];

  get filteredCompanies(): CompanyItem[] {
    const term = this.search.trim().toLowerCase();

    return this.companies.filter((company) => {
      const matchesSearch =
        !term ||
        company.id.toLowerCase().includes(term) ||
        company.name.toLowerCase().includes(term) ||
        company.sector.toLowerCase().includes(term);

      const matchesStatus =
        this.statusFilter === 'All' || company.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  toggleApproval(company: CompanyItem): void {
    company.status = company.status === 'Approved' ? 'Pending' : 'Approved';
  }
}
