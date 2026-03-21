import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface CompanyDetail {
  id: string;
  name: string;
  sector: string;
  website: string;
  contact: string;
  description: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  activeJobs: number;
  totalHires: number;
  recentDrives: Array<{ title: string; date: string; status: string }>;
}

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-details.html',
  styleUrl: './company-details.css'
})
export class CompanyDetails {
  companyId = '';

  companies: CompanyDetail[] = [
    {
      id: 'CMP-101',
      name: 'Nexora Labs',
      sector: 'Software',
      website: 'https://nexoralabs.example',
      contact: 'careers@nexora.example',
      description: 'Product engineering and cloud infrastructure solutions.',
      status: 'Approved',
      activeJobs: 8,
      totalHires: 42,
      recentDrives: [
        { title: 'SDE Drive', date: '2026-03-04', status: 'Completed' },
        { title: 'Data Engineering Drive', date: '2026-03-20', status: 'Scheduled' }
      ]
    },
    {
      id: 'CMP-102',
      name: 'Skyline Mobility',
      sector: 'Automotive',
      website: 'https://skylinemobility.example',
      contact: 'recruitment@skyline.example',
      description: 'EV mobility platform with software and operations teams.',
      status: 'Pending',
      activeJobs: 3,
      totalHires: 10,
      recentDrives: [{ title: 'Graduate Trainee', date: '2026-03-18', status: 'Scheduled' }]
    }
  ];

  currentCompany: CompanyDetail = this.companies[0];

  constructor(private route: ActivatedRoute) {
    this.companyId = this.route.snapshot.paramMap.get('id') || this.companies[0].id;
    this.currentCompany =
      this.companies.find((company) => company.id === this.companyId) || this.companies[0];
  }

  setStatus(status: CompanyDetail['status']): void {
    this.currentCompany.status = status;
  }
}
