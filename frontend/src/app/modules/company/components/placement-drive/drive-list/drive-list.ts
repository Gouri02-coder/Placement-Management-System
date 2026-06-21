import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CompanyDriveRecord, getCompanyDrives, getCompanyPortalContext } from '../../../data/company-drive.data';

@Component({
  selector: 'app-drive-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './drive-list.html',
  styleUrl: './drive-list.css',
})
export class DriveList implements OnInit {
  companyName = '';
  companyBadge = '';
  drives: CompanyDriveRecord[] = [];
  filteredDrives: CompanyDriveRecord[] = [];
  isLoading = true;

  searchTerm = '';
  selectedStatus = 'all';
  selectedType = 'all';
  selectedBranch = 'all';

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  stats = {
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  };

  driveTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'onCampus', label: 'On-Campus' },
    { value: 'offCampus', label: 'Off-Campus' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  driveStatuses = [
    { value: 'all', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Data Science',
    'Artificial Intelligence',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDrives();
  }

  private loadDrives(): void {
    const context = getCompanyPortalContext();

    this.companyName = context.companyName;
    this.companyBadge = context.companyBadge;

    setTimeout(() => {
      this.drives = getCompanyDrives();
      this.filteredDrives = [...this.drives];
      this.updateStats();
      this.calculateTotalPages();
      this.isLoading = false;
    }, 350);
  }

  private updateStats(): void {
    this.stats.total = this.drives.length;
    this.stats.upcoming = this.drives.filter((drive) => drive.status === 'scheduled').length;
    this.stats.ongoing = this.drives.filter((drive) => drive.status === 'ongoing').length;
    this.stats.completed = this.drives.filter((drive) => drive.status === 'completed').length;
  }

  applyFilters(): void {
    this.filteredDrives = this.drives.filter((drive) => {
      const matchesSearch =
        drive.driveName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        drive.driveCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        drive.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        drive.roles.some((role) => role.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesStatus = this.selectedStatus === 'all' || drive.status === this.selectedStatus;
      const matchesType = this.selectedType === 'all' || drive.driveType === this.selectedType;
      const matchesBranch = this.selectedBranch === 'all' || drive.eligibleBranches.includes(this.selectedBranch);

      return matchesSearch && matchesStatus && matchesType && matchesBranch;
    });

    this.currentPage = 1;
    this.calculateTotalPages();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredDrives.length / this.itemsPerPage);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
  }

  get paginatedDrives(): CompanyDriveRecord[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDrives.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    return pages;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedType = 'all';
    this.selectedBranch = 'all';
    this.applyFilters();
  }

  viewDetails(drive: CompanyDriveRecord): void {
    this.router.navigate(['/company/drives/details', drive.id], {
      queryParams: { tab: 'overview' },
    });
  }

  manageDrive(drive: CompanyDriveRecord): void {
    this.router.navigate(['/company/drives/details', drive.id], {
      queryParams: { tab: 'roles' },
    });
  }

  getDaysRemaining(date: string): number {
    const eventDate = new Date(date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getTotalRoles(drive: CompanyDriveRecord): number {
    return drive.roles.length;
  }

  getFilledSeats(drive: CompanyDriveRecord): number {
    return drive.roles.reduce((count, role) => count + role.offers, 0);
  }

  getDriveTypeLabel(type: CompanyDriveRecord['driveType']): string {
    switch (type) {
      case 'onCampus':
        return 'On-Campus';
      case 'offCampus':
        return 'Off-Campus';
      case 'virtual':
        return 'Virtual';
      case 'hybrid':
        return 'Hybrid';
      default:
        return type;
    }
  }

  isRegistrationOpen(deadline: string, status: string): boolean {
    return status === 'scheduled' && new Date(deadline) > new Date();
  }
}
