import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ApplicationFiltersComponent } from './application-filters';

describe('ApplicationFiltersComponent', () => {
  let component: ApplicationFiltersComponent;
  let fixture: ComponentFixture<ApplicationFiltersComponent>;

  const mockApplications = [
    { jobTitle: 'Frontend Developer', branch: 'Computer Science', status: 'pending', cgpa: 8.5 },
    { jobTitle: 'Backend Developer', branch: 'Information Technology', status: 'shortlisted', cgpa: 7.8 },
    { jobTitle: 'Frontend Developer', branch: 'Computer Science', status: 'hired', cgpa: 9.2 },
    { jobTitle: 'Data Analyst', branch: 'Data Science', status: 'reviewed', cgpa: 8.0 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationFiltersComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationFiltersComponent);
    component = fixture.componentInstance;
    component.applications = mockApplications;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.searchTerm).toBe('');
      expect(component.statusFilter).toBe('all');
      expect(component.jobFilter).toBe('all');
      expect(component.branchFilter).toBe('all');
      expect(component.minCGPA).toBe('');
    });
  });

  describe('Unique Values', () => {
    it('should get unique jobs', () => {
      const jobs = component.getUniqueJobs();
      expect(jobs.length).toBe(3);
      expect(jobs).toContain('Frontend Developer');
      expect(jobs).toContain('Backend Developer');
      expect(jobs).toContain('Data Analyst');
    });

    it('should get unique branches', () => {
      const branches = component.getUniqueBranches();
      expect(branches.length).toBe(3);
      expect(branches).toContain('Computer Science');
      expect(branches).toContain('Information Technology');
      expect(branches).toContain('Data Science');
    });

    it('should return empty array when applications is empty', () => {
      component.applications = [];
      expect(component.getUniqueJobs()).toEqual([]);
      expect(component.getUniqueBranches()).toEqual([]);
    });
  });

  describe('Apply Filters', () => {
    it('should emit filters when applying', () => {
      spyOn(component.filtersChange, 'emit');
      spyOn(component.searchChange, 'emit');
      
      component.statusFilter = 'pending';
      component.applyFilters();
      
      expect(component.filtersChange.emit).toHaveBeenCalled();
      expect(component.searchChange.emit).toHaveBeenCalled();
    });

    it('should set job filter correctly', () => {
      component.jobFilter = 'Frontend Developer';
      component.applyFilters();
      expect(component.filters.jobId).toBe('Frontend Developer');
    });

    it('should set status filter correctly', () => {
      component.statusFilter = 'shortlisted';
      component.applyFilters();
      expect(component.filters.status).toBe('shortlisted');
    });

    it('should set branch filter correctly', () => {
      component.branchFilter = 'Computer Science';
      component.applyFilters();
      expect(component.filters.branch).toBe('Computer Science');
    });

    it('should set CGPA filter correctly', () => {
      component.minCGPA = '7.5';
      component.applyFilters();
      expect(component.filters.minCGPA).toBe(7.5);
    });

    it('should not set filters for "all" values', () => {
      component.statusFilter = 'all';
      component.jobFilter = 'all';
      component.branchFilter = 'all';
      component.minCGPA = '';
      component.applyFilters();
      expect(component.filters).toEqual({});
    });
  });

  describe('Clear Filters', () => {
    it('should clear all filters', () => {
      component.searchTerm = 'test';
      component.statusFilter = 'pending';
      component.jobFilter = 'Frontend Developer';
      component.branchFilter = 'Computer Science';
      component.minCGPA = '7.5';
      
      component.clearFilters();
      
      expect(component.searchTerm).toBe('');
      expect(component.statusFilter).toBe('all');
      expect(component.jobFilter).toBe('all');
      expect(component.branchFilter).toBe('all');
      expect(component.minCGPA).toBe('');
    });

    it('should emit empty filters when clearing', () => {
      spyOn(component.filtersChange, 'emit');
      spyOn(component.searchChange, 'emit');
      
      component.clearFilters();
      
      expect(component.filtersChange.emit).toHaveBeenCalledWith({});
      expect(component.searchChange.emit).toHaveBeenCalledWith('');
    });
  });

  describe('Active Filters', () => {
    it('should detect active filters', () => {
      expect(component.hasActiveFilters()).toBeFalse();
      
      component.statusFilter = 'pending';
      expect(component.hasActiveFilters()).toBeTrue();
    });

    it('should count active filters correctly', () => {
      expect(component.getActiveFiltersCount()).toBe(0);
      
      component.statusFilter = 'pending';
      expect(component.getActiveFiltersCount()).toBe(1);
      
      component.jobFilter = 'Frontend Developer';
      expect(component.getActiveFiltersCount()).toBe(2);
      
      component.searchTerm = 'test';
      expect(component.getActiveFiltersCount()).toBe(3);
      
      component.minCGPA = '7.5';
      expect(component.getActiveFiltersCount()).toBe(4);
    });
  });

  describe('Reset Individual Filters', () => {
    it('should reset status filter', () => {
      component.statusFilter = 'pending';
      component.resetFilter('status');
      expect(component.statusFilter).toBe('all');
    });

    it('should reset job filter', () => {
      component.jobFilter = 'Frontend Developer';
      component.resetFilter('job');
      expect(component.jobFilter).toBe('all');
    });

    it('should reset branch filter', () => {
      component.branchFilter = 'Computer Science';
      component.resetFilter('branch');
      expect(component.branchFilter).toBe('all');
    });

    it('should reset CGPA filter', () => {
      component.minCGPA = '7.5';
      component.resetFilter('cgpa');
      expect(component.minCGPA).toBe('');
    });

    it('should reset search filter', () => {
      component.searchTerm = 'test';
      component.resetFilter('search');
      expect(component.searchTerm).toBe('');
    });
  });

  describe('Helper Methods', () => {
    it('should format CGPA value', () => {
      component.minCGPA = '7.5';
      expect(component.getCGPAValue()).toBe('7.5');
      
      component.minCGPA = '';
      expect(component.getCGPAValue()).toBe('');
    });
  });

  describe('Search Debounce', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should debounce search input', () => {
      spyOn(component, 'applyFilters');
      
      component.onSearchChange();
      component.onSearchChange();
      component.onSearchChange();
      
      expect(component.applyFilters).not.toHaveBeenCalled();
      
      jasmine.clock().tick(300);
      expect(component.applyFilters).toHaveBeenCalledTimes(1);
    });
  });
});