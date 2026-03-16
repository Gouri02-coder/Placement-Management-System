import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface CompanyVerificationItem {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  verificationStep: string;
  status: 'pending' | 'approved';
}

@Component({
  selector: 'app-company-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-verification.html',
  styleUrls: ['./company-verification.css']
})
export class CompanyVerificationComponent {
  companies: CompanyVerificationItem[] = [
    {
      id: 'CMP-205',
      name: 'Elevate Tech',
      industry: 'Software Services',
      contactPerson: 'Neeraj Malhotra',
      verificationStep: 'GST and offer letter template review',
      status: 'pending'
    },
    {
      id: 'CMP-227',
      name: 'BluePeak Analytics',
      industry: 'Analytics',
      contactPerson: 'Ritika Singh',
      verificationStep: 'Salary breakup confirmation',
      status: 'pending'
    },
    {
      id: 'CMP-231',
      name: 'Vertex Manufacturing',
      industry: 'Core Engineering',
      contactPerson: 'Sonal Patil',
      verificationStep: 'Approved for drive scheduling',
      status: 'approved'
    }
  ];

  approveCompany(companyId: string): void {
    this.companies = this.companies.map(company =>
      company.id === companyId ? { ...company, status: 'approved' } : company
    );
  }

  get pendingCount(): number {
    return this.companies.filter(company => company.status === 'pending').length;
  }
}
