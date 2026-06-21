import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Drive } from '../../services/drive.service';
import { PtoDriveStoreService } from '../../services/pto-drive-store.service';

type DriveFormData = Omit<Drive, 'id' | 'createdAt' | 'updatedAt'>;

@Component({
  selector: 'app-drive-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drive-list.component.html',
  styleUrls: ['./drive-list.component.css']
})
export class DriveListComponent implements OnInit {
  drives: Drive[] = [];
  filteredDrives: Drive[] = [];
  
  totalDrives = 0;
  activeDrives = 0;
  upcomingDrives = 0;
  completedDrives = 0;
  
  loading = false;
  error = '';
  
  searchTerm = '';
  statusFilter = 'all';
  typeFilter = 'all';
  
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  
  showModal = false;
  editingDrive: Drive | null = null;
  
  formData: DriveFormData = this.createDefaultFormData();
  
  yearsInput = '3,4';

  constructor(
    private driveStore: PtoDriveStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDrives();
  }

  private createDefaultFormData(): DriveFormData {
    return {
      title: '',
      companyName: '',
      companyId: 0,
      description: '',
      driveType: 'ON_CAMPUS',
      mode: 'ONLINE',
      location: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      eligibilityCriteria: {
        minCgpa: 7.0,
        allowedBranches: [],
        allowedYears: [3, 4],
        backlogsAllowed: false
      },
      positions: [],
      status: 'UPCOMING',
      registeredStudents: 0,
      selectedStudents: 0
    };
  }

  fetchDrives(): void {
    this.loading = true;
    this.error = '';

    this.drives = this.driveStore.getDrives();
    this.updateDriveMetrics();
    this.filterDrives();

    this.loading = false;
  }

  private updateDriveMetrics(): void {
    this.totalDrives = this.drives.length;
    this.activeDrives = this.drives.filter(d => d.status === 'ACTIVE').length;
    this.upcomingDrives = this.drives.filter(d => d.status === 'UPCOMING').length;
    this.completedDrives = this.drives.filter(d => d.status === 'COMPLETED').length;
  }

  filterDrives(): void {
    let filtered = [...this.drives];
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === this.statusFilter);
    }
    
    if (this.typeFilter !== 'all') {
      filtered = filtered.filter(d => d.driveType === this.typeFilter);
    }
    
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(search) ||
        d.companyName.toLowerCase().includes(search) ||
        d.location.toLowerCase().includes(search)
      );
    }
    
    this.filteredDrives = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDrives.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  get paginatedDrives(): Drive[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredDrives.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  refresh(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.typeFilter = 'all';
    this.currentPage = 1;
    this.fetchDrives();
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'ACTIVE': return 'fas fa-play';
      case 'UPCOMING': return 'fas fa-clock';
      case 'COMPLETED': return 'fas fa-check';
      default: return 'fas fa-question';
    }
  }

  openCreateDriveModal(): void {
    this.editingDrive = null;
    this.formData = this.createDefaultFormData();
    this.yearsInput = '3,4';
    this.showModal = true;
  }

  editDrive(drive: Drive): void {
    this.editingDrive = drive;
    this.formData = {
      title: drive.title,
      companyName: drive.companyName,
      companyId: drive.companyId,
      description: drive.description,
      driveType: drive.driveType,
      mode: drive.mode,
      location: drive.location,
      startDate: drive.startDate,
      endDate: drive.endDate,
      registrationDeadline: drive.registrationDeadline,
      eligibilityCriteria: {
        minCgpa: drive.eligibilityCriteria.minCgpa,
        allowedBranches: [...drive.eligibilityCriteria.allowedBranches],
        allowedYears: [...drive.eligibilityCriteria.allowedYears],
        backlogsAllowed: drive.eligibilityCriteria.backlogsAllowed
      },
      positions: drive.positions.map(position => ({ ...position })),
      status: drive.status,
      registeredStudents: drive.registeredStudents,
      selectedStudents: drive.selectedStudents
    };
    this.yearsInput = drive.eligibilityCriteria?.allowedYears?.join(',') || '3,4';
    this.showModal = true;
  }

  saveDrive(): void {
    this.formData.eligibilityCriteria.allowedYears = this.yearsInput
      .split(',')
      .map(y => parseInt(y.trim(), 10))
      .filter(y => !Number.isNaN(y));

    const now = new Date().toISOString();
    
    if (this.editingDrive) {
      this.drives = this.drives.map(drive =>
        drive.id === this.editingDrive?.id
          ? {
              ...drive,
              ...this.formData,
              eligibilityCriteria: {
                ...this.formData.eligibilityCriteria,
                allowedBranches: [...this.formData.eligibilityCriteria.allowedBranches],
                allowedYears: [...this.formData.eligibilityCriteria.allowedYears]
              },
              positions: this.formData.positions.map(position => ({ ...position })),
              updatedAt: now
            }
          : drive
      );

      this.driveStore.saveDrives(this.drives);
      this.updateDriveMetrics();
      this.filterDrives();
      this.closeModal();
      alert('Drive updated successfully!');
    } else {
      const nextId = this.drives.length > 0 ? Math.max(...this.drives.map(drive => drive.id)) + 1 : 1;
      const newDrive: Drive = {
        id: nextId,
        ...this.formData,
        eligibilityCriteria: {
          ...this.formData.eligibilityCriteria,
          allowedBranches: [...this.formData.eligibilityCriteria.allowedBranches],
          allowedYears: [...this.formData.eligibilityCriteria.allowedYears]
        },
        positions: this.formData.positions.map(position => ({ ...position })),
        createdAt: now,
        updatedAt: now
      };

      this.drives = [newDrive, ...this.drives];
      this.driveStore.saveDrives(this.drives);
      this.updateDriveMetrics();
      this.filterDrives();
      this.closeModal();
      alert('Drive created successfully!');
    }
  }

  deleteDrive(drive: Drive): void {
    if (confirm(`Are you sure you want to delete "${drive.title}"?`)) {
      this.drives = this.drives.filter(existingDrive => existingDrive.id !== drive.id);
      this.driveStore.saveDrives(this.drives);
      this.updateDriveMetrics();
      this.filterDrives();

      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }

      alert('Drive deleted successfully!');
    }
  }

  resetToSeedData(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.typeFilter = 'all';
    this.currentPage = 1;

    this.driveStore.saveDrives(this.driveStore.getSeedDrives());
    this.fetchDrives();
  }

  viewDriveDetails(driveId: number): void {
    this.router.navigate(['/pto/placement-drives/drive-details', driveId]);
  }

  closeModal(): void {
    this.showModal = false;
    this.editingDrive = null;
  }
}
