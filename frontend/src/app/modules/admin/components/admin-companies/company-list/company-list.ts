import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface CompanyRecord {
  id: string;
  name: string;
  sector: string;
  openings: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  packageLpa: number;
}

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css'
})
export class CompanyList {
  search = '';
  statusFilter: 'All' | CompanyRecord['status'] = 'All';

  companies: CompanyRecord[] = [
    { id: 'CMP-101', name: 'Nexora Labs', sector: 'Software', openings: 18, status: 'Approved', packageLpa: 14 },
    { id: 'CMP-102', name: 'Skyline Mobility', sector: 'Automotive', openings: 9, status: 'Pending', packageLpa: 8 },
    { id: 'CMP-103', name: 'ByteWorks', sector: 'Cloud', openings: 26, status: 'Approved', packageLpa: 12 },
    { id: 'CMP-104', name: 'Retail Grid', sector: 'Ecommerce', openings: 12, status: 'Rejected', packageLpa: 7 },
    { id: 'CMP-105', name: 'CoreMatrix', sector: 'Semiconductor', openings: 6, status: 'Pending', packageLpa: 11 }
  ];

  get filteredCompanies(): CompanyRecord[] {
    return this.companies.filter((company) => {
      const q = this.search.toLowerCase();
      const matchesQuery =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.sector.toLowerCase().includes(q) ||
        company.id.toLowerCase().includes(q);
      const matchesStatus = this.statusFilter === 'All' || company.status === this.statusFilter;
      return matchesQuery && matchesStatus;
    });
  }

  toggleApproval(company: CompanyRecord): void {
    if (company.status === 'Pending') {
      company.status = 'Approved';
      return;
    }

    if (company.status === 'Approved') {
      company.status = 'Pending';
    }
  }
}
