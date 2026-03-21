import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReports {
  range: '7d' | '30d' | '90d' = '30d';
  selectedFormat: 'PDF' | 'Excel' = 'PDF';
  message = '';

  readonly cards = [
    { label: 'Placement Rate', value: '84.6%' },
    { label: 'Avg Package', value: '10.8 LPA' },
    { label: 'Total Offers', value: '732' },
    { label: 'Active Drives', value: '14' }
  ];

  downloadReport(): void {
    this.message = `Report queued for ${this.range} in ${this.selectedFormat} format.`;
  }
}
