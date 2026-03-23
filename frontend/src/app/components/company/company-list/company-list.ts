import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface CompanyListItem {
  id: string;
  name: string;
  sector: string;
  openings: number;
  packageLpa: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

@Component({
  selector: 'app-company-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css'
})
export class CompanyList {
  search = '';
  statusFilter: CompanyListItem['status'] | 'All' = 'All';

  companies: CompanyListItem[] = [
    {
      id: 'CMP-101',
      name: 'TechNova Solutions',
      sector: 'Software',
      openings: 18,
      packageLpa: 12,
      status: 'Approved'
    },
    {
      id: 'CMP-102',
      name: 'FinEdge Analytics',
      sector: 'FinTech',
      openings: 10,
      packageLpa: 9,
      status: 'Pending'
    },
    {
      id: 'CMP-103',
      name: 'GreenGrid Energy',
      sector: 'Energy',
      openings: 6,
      packageLpa: 8,
      status: 'Rejected'
    },
    {
      id: 'CMP-104',
      name: 'CloudOrbit Labs',
      sector: 'Cloud Infrastructure',
      openings: 14,
      packageLpa: 15,
      status: 'Approved'
    }
  ];

  get filteredCompanies(): CompanyListItem[] {
    const query = this.search.trim().toLowerCase();

    return this.companies.filter((company) => {
      const matchesSearch =
        !query ||
        company.id.toLowerCase().includes(query) ||
        company.name.toLowerCase().includes(query) ||
        company.sector.toLowerCase().includes(query);

      const matchesStatus =
        this.statusFilter === 'All' || company.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  toggleApproval(company: CompanyListItem): void {
    company.status = company.status === 'Approved' ? 'Pending' : 'Approved';
  }
}
