import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminApprovalStoreService, ApprovalItem } from '../../admin-approval-store.service';

type ReportRange = '7d' | '30d' | '90d';
type ReportFormat = 'PDF' | 'Excel';

interface StudentReportRecord {
  id: string;
  name: string;
  department: string;
  cgpa: number;
  status: 'Placed' | 'In Process' | 'Not Started';
  company: string;
}

interface CompanyReportRecord {
  id: string;
  name: string;
  sector: string;
  openings: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  packageLpa: number;
}

interface DriveReportRecord {
  id: string;
  company: string;
  role: string;
  date: string;
  venue: string;
  slots: number;
  placed: number;
  status: 'Scheduled' | 'Published' | 'Cancelled' | 'Running' | 'Closed';
}

interface ReportSummaryItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReports {
  private readonly approvalStore = inject(AdminApprovalStoreService);

  range: ReportRange = '30d';
  selectedFormat: ReportFormat = 'PDF';
  message = '';

  readonly students: StudentReportRecord[] = [
    { id: 'ST-101', name: 'Arjun Mehta', department: 'CSE', cgpa: 8.9, status: 'Placed', company: 'Nexora Labs' },
    { id: 'ST-102', name: 'Isha Verma', department: 'IT', cgpa: 8.2, status: 'In Process', company: 'ByteWorks' },
    { id: 'ST-103', name: 'Rohan Singh', department: 'ECE', cgpa: 7.7, status: 'Not Started', company: '-' },
    { id: 'ST-104', name: 'Ananya Das', department: 'CSE', cgpa: 9.1, status: 'Placed', company: 'CloudArc' },
    { id: 'ST-105', name: 'Karan Patel', department: 'ME', cgpa: 7.9, status: 'In Process', company: 'FleetEdge' }
  ];

  readonly companies: CompanyReportRecord[] = [
    { id: 'CMP-101', name: 'Nexora Labs', sector: 'Software', openings: 18, status: 'Approved', packageLpa: 14 },
    { id: 'CMP-102', name: 'Skyline Mobility', sector: 'Automotive', openings: 9, status: 'Pending', packageLpa: 8 },
    { id: 'CMP-103', name: 'ByteWorks', sector: 'Cloud', openings: 26, status: 'Approved', packageLpa: 12 },
    { id: 'CMP-104', name: 'Retail Grid', sector: 'Ecommerce', openings: 12, status: 'Rejected', packageLpa: 7 },
    { id: 'CMP-105', name: 'CoreMatrix', sector: 'Semiconductor', openings: 6, status: 'Pending', packageLpa: 11 }
  ];

  readonly drives: DriveReportRecord[] = [
    {
      id: 'DRV-301',
      company: 'Nexora Labs',
      role: 'Frontend Engineer',
      date: '2026-03-18',
      venue: 'Auditorium A',
      slots: 40,
      placed: 26,
      status: 'Published'
    },
    {
      id: 'DRV-302',
      company: 'CoreMatrix',
      role: 'Embedded Trainee',
      date: '2026-03-22',
      venue: 'Seminar Hall 2',
      slots: 28,
      placed: 18,
      status: 'Scheduled'
    },
    {
      id: 'DRV-303',
      company: 'ByteWorks',
      role: 'Graduate Hiring Program',
      date: '2026-02-26',
      venue: 'Placement Cell',
      slots: 60,
      placed: 60,
      status: 'Closed'
    }
  ];

  get cards(): ReportSummaryItem[] {
    const placedStudents = this.students.filter((student) => student.status === 'Placed').length;
    const placementRate = this.students.length ? (placedStudents / this.students.length) * 100 : 0;
    const averagePackage =
      this.companies.reduce((sum, company) => sum + company.packageLpa, 0) / this.companies.length || 0;
    const totalOffers = this.drives.reduce((sum, drive) => sum + drive.placed, 0);
    const activeDrives = this.drives.filter((drive) =>
      ['Scheduled', 'Published', 'Running'].includes(drive.status)
    ).length;

    return [
      { label: 'Placement Rate', value: `${placementRate.toFixed(1)}%` },
      { label: 'Avg Package', value: `${averagePackage.toFixed(1)} LPA` },
      { label: 'Total Offers', value: `${totalOffers}` },
      { label: 'Active Drives', value: `${activeDrives}` }
    ];
  }

  downloadReport(): void {
    const generatedAt = new Date();
    const approvalsInRange = this.getApprovalsInRange(generatedAt);
    const drivesInRange = this.getDrivesInRange(generatedAt);
    const summary = this.buildSummary(approvalsInRange, drivesInRange, generatedAt);

    if (this.selectedFormat === 'Excel') {
      const csvContent = this.buildCsvContent(summary, approvalsInRange, drivesInRange, generatedAt);
      const blob = new Blob(['\uFEFF', csvContent], { type: 'text/csv;charset=utf-8;' });
      this.downloadBlob(blob, this.buildFilename(generatedAt, 'csv'));
    } else {
      const reportLines = this.buildPdfLines(summary, approvalsInRange, drivesInRange, generatedAt);
      const blob = this.buildPdfBlob(reportLines);
      this.downloadBlob(blob, this.buildFilename(generatedAt, 'pdf'));
    }

    this.message = `Downloaded ${this.selectedFormat} report for ${this.getRangeLabel()} with summary, students, companies, approvals, and drive details.`;
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private buildSummary(
    approvalsInRange: ApprovalItem[],
    drivesInRange: DriveReportRecord[],
    generatedAt: Date
  ): ReportSummaryItem[] {
    const placedStudents = this.students.filter((student) => student.status === 'Placed').length;
    const avgCgpa = this.students.reduce((sum, student) => sum + student.cgpa, 0) / this.students.length || 0;
    const approvedCompanies = this.companies.filter((company) => company.status === 'Approved').length;
    const pendingApprovals = approvalsInRange.filter((approval) => approval.status === 'Pending').length;
    const totalDriveSlots = drivesInRange.reduce((sum, drive) => sum + drive.slots, 0);
    const totalOffers = drivesInRange.reduce((sum, drive) => sum + drive.placed, 0);

    return [
      { label: 'Range', value: this.getRangeLabel() },
      { label: 'Generated On', value: this.formatDateTime(generatedAt.toISOString()) },
      { label: 'Students Reviewed', value: `${this.students.length}` },
      { label: 'Students Placed', value: `${placedStudents}` },
      { label: 'Average CGPA', value: avgCgpa.toFixed(2) },
      { label: 'Companies Approved', value: `${approvedCompanies}` },
      { label: 'Pending Approvals', value: `${pendingApprovals}` },
      { label: 'Drives In Range', value: `${drivesInRange.length}` },
      { label: 'Drive Slots', value: `${totalDriveSlots}` },
      { label: 'Offers In Range', value: `${totalOffers}` }
    ];
  }

  private buildCsvContent(
    summary: ReportSummaryItem[],
    approvalsInRange: ApprovalItem[],
    drivesInRange: DriveReportRecord[],
    generatedAt: Date
  ): string {
    const sections: string[] = [];

    sections.push(this.toCsvRow(['Admin Placement Report']));
    sections.push(this.toCsvRow(['Generated On', this.formatDateTime(generatedAt.toISOString())]));
    sections.push(this.toCsvRow(['Range', this.getRangeLabel()]));
    sections.push('');

    sections.push(this.toCsvRow(['Summary']));
    sections.push(this.toCsvRow(['Metric', 'Value']));
    summary.forEach((item) => sections.push(this.toCsvRow([item.label, item.value])));
    sections.push('');

    sections.push(this.toCsvRow(['Students']));
    sections.push(this.toCsvRow(['ID', 'Name', 'Department', 'CGPA', 'Status', 'Assigned Company']));
    this.students.forEach((student) =>
      sections.push(
        this.toCsvRow([
          student.id,
          student.name,
          student.department,
          student.cgpa.toFixed(1),
          student.status,
          student.company
        ])
      )
    );
    sections.push('');

    sections.push(this.toCsvRow(['Companies']));
    sections.push(this.toCsvRow(['ID', 'Name', 'Sector', 'Openings', 'Status', 'Package (LPA)']));
    this.companies.forEach((company) =>
      sections.push(
        this.toCsvRow([
          company.id,
          company.name,
          company.sector,
          `${company.openings}`,
          company.status,
          company.packageLpa.toFixed(1)
        ])
      )
    );
    sections.push('');

    sections.push(this.toCsvRow(['Approvals In Range']));
    sections.push(this.toCsvRow(['ID', 'Name', 'Sector', 'Contact', 'Submitted On', 'Status']));
    approvalsInRange.forEach((approval) =>
      sections.push(
        this.toCsvRow([
          approval.id,
          approval.name,
          approval.sector,
          approval.contact,
          approval.submittedOn,
          approval.status
        ])
      )
    );
    sections.push('');

    sections.push(this.toCsvRow(['Placement Drives In Range']));
    sections.push(this.toCsvRow(['ID', 'Company', 'Role', 'Date', 'Venue', 'Slots', 'Placed', 'Status']));
    drivesInRange.forEach((drive) =>
      sections.push(
        this.toCsvRow([
          drive.id,
          drive.company,
          drive.role,
          drive.date,
          drive.venue,
          `${drive.slots}`,
          `${drive.placed}`,
          drive.status
        ])
      )
    );

    return sections.join('\n');
  }

  private buildPdfLines(
    summary: ReportSummaryItem[],
    approvalsInRange: ApprovalItem[],
    drivesInRange: DriveReportRecord[],
    generatedAt: Date
  ): string[] {
    const lines: string[] = [
      'ADMIN PLACEMENT REPORT',
      `Generated On: ${this.formatDateTime(generatedAt.toISOString())}`,
      `Range: ${this.getRangeLabel()}`,
      '',
      'SUMMARY'
    ];

    summary.forEach((item) => lines.push(`${item.label}: ${item.value}`));

    lines.push('', 'STUDENTS');
    this.students.forEach((student) =>
      lines.push(
        `${student.id} | ${student.name} | ${student.department} | CGPA ${student.cgpa.toFixed(1)} | ${student.status} | ${student.company}`
      )
    );

    lines.push('', 'COMPANIES');
    this.companies.forEach((company) =>
      lines.push(
        `${company.id} | ${company.name} | ${company.sector} | Openings ${company.openings} | ${company.status} | ${company.packageLpa.toFixed(1)} LPA`
      )
    );

    lines.push('', 'APPROVALS IN RANGE');
    approvalsInRange.forEach((approval) =>
      lines.push(
        `${approval.id} | ${approval.name} | ${approval.sector} | ${approval.contact} | ${approval.submittedOn} | ${approval.status}`
      )
    );

    lines.push('', 'PLACEMENT DRIVES IN RANGE');
    drivesInRange.forEach((drive) =>
      lines.push(
        `${drive.id} | ${drive.company} | ${drive.role} | ${drive.date} | ${drive.venue} | Slots ${drive.slots} | Placed ${drive.placed} | ${drive.status}`
      )
    );

    return lines;
  }

  private buildPdfBlob(lines: string[]): Blob {
    const linesPerPage = 38;
    const pages = this.chunkLines(lines, linesPerPage);
    const objects: string[] = [];
    const pageObjectIds: number[] = [];
    const fontObjectId = 3 + pages.length * 2;

    for (let index = 0; index < pages.length; index += 1) {
      const pageObjectId = 3 + index * 2;
      const contentObjectId = pageObjectId + 1;
      const content = this.buildPdfPageContent(pages[index]);

      pageObjectIds.push(pageObjectId);
      objects[pageObjectId] =
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
      objects[contentObjectId] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    }

    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;
    objects[fontObjectId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [0];

    for (let index = 1; index < objects.length; index += 1) {
      if (!objects[index]) {
        continue;
      }

      offsets[index] = pdf.length;
      pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
    }

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length}\n`;
    pdf += '0000000000 65535 f \n';

    for (let index = 1; index < objects.length; index += 1) {
      const offset = offsets[index] ?? 0;
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return new Blob([pdf], { type: 'application/pdf' });
  }

  private buildPdfPageContent(lines: string[]): string {
    const sanitizedLines = lines.map((line) => this.escapePdfText(line).replace(/[^\x20-\x7E]/g, ''));
    const contentLines: string[] = ['BT', '/F1 10 Tf', '14 TL', '50 770 Td'];

    sanitizedLines.forEach((line, index) => {
      if (index > 0) {
        contentLines.push('T*');
      }

      contentLines.push(`(${line}) Tj`);
    });

    contentLines.push('ET');
    return contentLines.join('\n');
  }

  private getApprovalsInRange(generatedAt: Date) {
    const cutoffTime = this.getCutoffDate(generatedAt).getTime();
    return this.approvalStore.approvals.filter((approval) => new Date(approval.submittedOn).getTime() >= cutoffTime);
  }

  private getDrivesInRange(generatedAt: Date): DriveReportRecord[] {
    const cutoffTime = this.getCutoffDate(generatedAt).getTime();
    return this.drives.filter((drive) => new Date(drive.date).getTime() >= cutoffTime);
  }

  private getCutoffDate(referenceDate: Date): Date {
    const days = this.range === '7d' ? 7 : this.range === '30d' ? 30 : 90;
    const cutoffDate = new Date(referenceDate);
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return cutoffDate;
  }

  private getRangeLabel(): string {
    if (this.range === '7d') {
      return 'Last 7 days';
    }

    if (this.range === '90d') {
      return 'Last 90 days';
    }

    return 'Last 30 days';
  }

  private buildFilename(generatedAt: Date, extension: 'csv' | 'pdf'): string {
    const datePart = generatedAt.toISOString().split('T')[0];
    const rangePart = this.range.toLowerCase();
    return `admin-placement-report-${rangePart}-${datePart}.${extension}`;
  }

  private toCsvRow(values: string[]): string {
    return values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',');
  }

  private formatDateTime(value: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  }

  private chunkLines(lines: string[], chunkSize: number): string[][] {
    const chunks: string[][] = [];

    for (let index = 0; index < lines.length; index += chunkSize) {
      chunks.push(lines.slice(index, index + chunkSize));
    }

    return chunks.length ? chunks : [['Admin Placement Report']];
  }

  private escapePdfText(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }
}
