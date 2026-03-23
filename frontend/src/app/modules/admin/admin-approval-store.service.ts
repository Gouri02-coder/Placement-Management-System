import { Injectable } from '@angular/core';

export interface ApprovalItem {
  id: string;
  name: string;
  sector: string;
  contact: string;
  submittedOn: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({
  providedIn: 'root'
})
export class AdminApprovalStoreService {
  readonly approvals: ApprovalItem[] = [
    {
      id: 'CMP-102',
      name: 'Skyline Mobility',
      sector: 'Automotive',
      contact: 'hr@skyline.com',
      submittedOn: '2026-03-02',
      status: 'Pending'
    },
    {
      id: 'CMP-105',
      name: 'CoreMatrix',
      sector: 'Semiconductor',
      contact: 'people@corematrix.com',
      submittedOn: '2026-03-01',
      status: 'Pending'
    },
    {
      id: 'CMP-110',
      name: 'QuantNest',
      sector: 'Fintech',
      contact: 'recruit@quantnest.com',
      submittedOn: '2026-02-27',
      status: 'Approved'
    }
  ];

  get pendingApprovals(): ApprovalItem[] {
    return this.approvals.filter((item) => item.status === 'Pending');
  }

  approve(item: ApprovalItem): void {
    item.status = 'Approved';
  }

  reject(item: ApprovalItem): void {
    item.status = 'Rejected';
  }
}
