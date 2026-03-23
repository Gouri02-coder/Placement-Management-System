import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DriveList } from './drive-list';

describe('DriveList', () => {
  let component: DriveList;
  let fixture: ComponentFixture<DriveList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveList, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriveList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Filter Methods', () => {
    beforeEach(() => {
      component.drives = [
        { driveName: 'Tech Drive', companyName: 'Tech Corp', status: 'scheduled', driveType: 'onCampus', eligibleBranches: ['Computer Science'], description: 'Test' },
        { driveName: 'IT Drive', companyName: 'IT Solutions', status: 'ongoing', driveType: 'virtual', eligibleBranches: ['Information Technology'], description: 'Test' }
      ];
      component.applyFilters();
    });

    it('should filter by search term', () => {
      component.searchTerm = 'Tech';
      component.applyFilters();
      expect(component.filteredDrives.length).toBe(1);
    });

    it('should filter by status', () => {
      component.selectedStatus = 'scheduled';
      component.applyFilters();
      expect(component.filteredDrives.length).toBe(1);
    });

    it('should filter by type', () => {
      component.selectedType = 'virtual';
      component.applyFilters();
      expect(component.filteredDrives.length).toBe(1);
    });

    it('should filter by branch', () => {
      component.selectedBranch = 'Computer Science';
      component.applyFilters();
      expect(component.filteredDrives.length).toBe(1);
    });

    it('should clear all filters', () => {
      component.searchTerm = 'test';
      component.selectedStatus = 'scheduled';
      component.selectedType = 'onCampus';
      component.selectedBranch = 'Computer Science';
      
      component.clearFilters();
      
      expect(component.searchTerm).toBe('');
      expect(component.selectedStatus).toBe('all');
      expect(component.selectedType).toBe('all');
      expect(component.selectedBranch).toBe('all');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.filteredDrives = Array(15).fill({});
      component.itemsPerPage = 6;
      component.applyFilters();
    });

    it('should calculate total pages correctly', () => {
      expect(component.totalPages).toBe(3);
    });

    it('should return paginated drives for page 1', () => {
      component.currentPage = 1;
      expect(component.paginatedDrives.length).toBe(6);
    });
  });

  describe('Helper Methods', () => {
    it('should return correct status class', () => {
      expect(component.getStatusClass('scheduled')).toBe('status-scheduled');
      expect(component.getStatusClass('ongoing')).toBe('status-ongoing');
      expect(component.getStatusClass('completed')).toBe('status-completed');
    });

    it('should return correct status icon', () => {
      expect(component.getStatusIcon('scheduled')).toBe('schedule');
      expect(component.getStatusIcon('ongoing')).toBe('play_circle');
      expect(component.getStatusIcon('completed')).toBe('check_circle');
    });

    it('should calculate days remaining', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      expect(component.getDaysRemaining(futureDate.toISOString())).toBe(10);
    });

    it('should check if registration is open', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      expect(component.isRegistrationOpen(futureDate.toISOString(), 'scheduled')).toBeTrue();
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      expect(component.isRegistrationOpen(pastDate.toISOString(), 'scheduled')).toBeFalse();
      expect(component.isRegistrationOpen(futureDate.toISOString(), 'completed')).toBeFalse();
    });
  });
});