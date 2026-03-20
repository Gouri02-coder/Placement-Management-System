import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ApprovalItem {
  id: string;
  name: string;
  sector: string;
  contact: string;
  submittedOn: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-company-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-approval.html',
  styleUrl: './company-approval.css'
})
export class CompanyApproval {
  query = '';
  showOnlyPending = true;

  approvals: ApprovalItem[] = [
    { id: 'CMP-102', name: 'Skyline Mobility', sector: 'Automotive', contact: 'hr@skyline.com', submittedOn: '2026-03-02', status: 'Pending' },
    { id: 'CMP-105', name: 'CoreMatrix', sector: 'Semiconductor', contact: 'people@corematrix.com', submittedOn: '2026-03-01', status: 'Pending' },
    { id: 'CMP-110', name: 'QuantNest', sector: 'Fintech', contact: 'recruit@quantnest.com', submittedOn: '2026-02-27', status: 'Approved' }
  ];

  get filteredApprovals(): ApprovalItem[] {
    return this.approvals.filter((item) => {
      const q = this.query.toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q);
      const matchesPending = !this.showOnlyPending || item.status === 'Pending';
      return matchesQuery && matchesPending;
    });
  }

  approve(item: ApprovalItem): void {
    item.status = 'Approved';
  }

  reject(item: ApprovalItem): void {
    item.status = 'Rejected';
  }
}
