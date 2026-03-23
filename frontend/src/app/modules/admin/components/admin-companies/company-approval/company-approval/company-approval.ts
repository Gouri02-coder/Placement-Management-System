import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  AdminApprovalStoreService,
  ApprovalItem
} from '../../../../admin-approval-store.service';

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

  constructor(private approvalStore: AdminApprovalStoreService) {}

  get approvals(): ApprovalItem[] {
    return this.approvalStore.approvals;
  }

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
    this.approvalStore.approve(item);
  }

  reject(item: ApprovalItem): void {
    this.approvalStore.reject(item);
  }
}

