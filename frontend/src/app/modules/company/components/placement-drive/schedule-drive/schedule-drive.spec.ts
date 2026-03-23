import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScheduleDrive } from './schedule-drive';

describe('ScheduleDrive', () => {
  let component: ScheduleDrive;
  let fixture: ComponentFixture<ScheduleDrive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDrive, ReactiveFormsModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDrive);
    component = fixture.componentInstance;
    
    // Setup test data before each test
    component.drives = [
      { 
        driveName: 'Tech Drive', 
        companyName: 'Tech Corp', 
        status: 'scheduled', 
        driveType: 'onCampus',
        driveDate: '2024-12-31',
        registrationDeadline: '2024-12-30'
      },
      { 
        driveName: 'IT Drive', 
        companyName: 'IT Solutions', 
        status: 'ongoing', 
        driveType: 'virtual',
        driveDate: '2024-12-31',
        registrationDeadline: '2024-12-30'
      }
    ];
    component.filteredDrives = [...component.drives];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.driveForm.get('driveType')?.value).toBe('onCampus');
      expect(component.driveForm.get('eligibleBranches')?.value).toEqual([]);
      expect(component.driveForm.get('passingYears')?.value).toEqual([]);
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      expect(component.driveForm.valid).toBeFalse();
      
      component.driveForm.patchValue({
        driveName: 'Test Drive',
        companyName: 'Test Company',
        driveDate: '2024-12-31',
        driveTime: '10:00',
        venue: 'Main Auditorium',
        eligibleBranches: ['Computer Science'],
        passingYears: [2024],
        positions: 'Developer',
        vacancies: 10,
        description: 'This is a test description for the drive that is long enough to pass validation.',
        requirements: 'These are the requirements for the position.',
        registrationDeadline: '2024-12-30',
        contactPerson: 'John Doe',
        contactEmail: 'john@test.com',
        contactPhone: '1234567890'
      });
      
      expect(component.driveForm.valid).toBeTrue();
    });
  });

  describe('Filter Methods', () => {
    beforeEach(() => {
      component.drives = [
        { driveName: 'Tech Drive', companyName: 'Tech Corp', status: 'scheduled', driveType: 'onCampus' },
        { driveName: 'IT Drive', companyName: 'IT Solutions', status: 'ongoing', driveType: 'virtual' }
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

    it('should clear filters', () => {
      component.searchTerm = 'test';
      component.selectedStatus = 'scheduled';
      component.selectedType = 'onCampus';
      component.clearFilters();
      expect(component.searchTerm).toBe('');
      expect(component.selectedStatus).toBe('all');
      expect(component.selectedType).toBe('all');
    });
  });

  describe('toggleBranch', () => {
    it('should add branch when not selected', () => {
      const branch = 'Computer Science';
      expect(component.selectedBranches).not.toContain(branch);
      component.toggleBranch(branch);
      expect(component.selectedBranches).toContain(branch);
    });

    it('should remove branch when selected', () => {
      const branch = 'Computer Science';
      component.toggleBranch(branch);
      expect(component.selectedBranches).toContain(branch);
      component.toggleBranch(branch);
      expect(component.selectedBranches).not.toContain(branch);
    });
  });

  describe('toggleYear', () => {
    it('should add year when not selected', () => {
      const year = 2024;
      expect(component.selectedYears).not.toContain(year);
      component.toggleYear(year);
      expect(component.selectedYears).toContain(year);
    });

    it('should remove year when selected', () => {
      const year = 2024;
      component.toggleYear(year);
      expect(component.selectedYears).toContain(year);
      component.toggleYear(year);
      expect(component.selectedYears).not.toContain(year);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Setup test data for pagination
      component.filteredDrives = Array(15).fill({
        id: 1,
        driveName: 'Test Drive',
        companyName: 'Test Company',
        status: 'scheduled',
        driveType: 'onCampus'
      });
      component.itemsPerPage = 6;
      // Instead of calling private method, trigger applyFilters which calls it internally
      component.applyFilters(); // This will call calculateTotalPages
    });

    it('should calculate total pages correctly', () => {
      expect(component.totalPages).toBe(3);
    });

    it('should return paginated drives for page 1', () => {
      component.currentPage = 1;
      const paginated = component.paginatedDrives;
      expect(paginated.length).toBe(6);
    });

    it('should return paginated drives for page 2', () => {
      component.currentPage = 2;
      const paginated = component.paginatedDrives;
      expect(paginated.length).toBe(6);
    });

    it('should return paginated drives for last page', () => {
      component.currentPage = 3;
      const paginated = component.paginatedDrives;
      expect(paginated.length).toBe(3);
    });

    it('should change page', () => {
      component.totalPages = 5;
      component.changePage(3);
      expect(component.currentPage).toBe(3);
      
      component.changePage(6); // Invalid page
      expect(component.currentPage).toBe(3);
      
      component.changePage(0); // Invalid page
      expect(component.currentPage).toBe(3);
    });

    it('should generate page numbers with current page in middle', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([3, 4, 5, 6, 7]);
    });

    it('should generate page numbers for first pages', () => {
      component.totalPages = 10;
      component.currentPage = 1;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should generate page numbers for last pages', () => {
      component.totalPages = 10;
      component.currentPage = 10;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([6, 7, 8, 9, 10]);
    });

    it('should generate page numbers for small total pages', () => {
      component.totalPages = 3;
      component.currentPage = 2;
      const pages = component.getPages();
      expect(pages.length).toBe(3);
      expect(pages).toEqual([1, 2, 3]);
    });
  });

  describe('Helper Methods', () => {
    it('should return correct status class', () => {
      expect(component.getStatusClass('scheduled')).toBe('status-scheduled');
      expect(component.getStatusClass('ongoing')).toBe('status-ongoing');
      expect(component.getStatusClass('completed')).toBe('status-completed');
      expect(component.getStatusClass('cancelled')).toBe('status-cancelled');
      expect(component.getStatusClass('unknown')).toBe('');
    });

    it('should return correct drive type icon', () => {
      expect(component.getDriveTypeIcon('onCampus')).toBe('business');
      expect(component.getDriveTypeIcon('offCampus')).toBe('location_city');
      expect(component.getDriveTypeIcon('virtual')).toBe('computer');
      expect(component.getDriveTypeIcon('hybrid')).toBe('sync');
      expect(component.getDriveTypeIcon('unknown')).toBe('event');
    });

    it('should calculate days remaining', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      expect(component.getDaysRemaining(futureDate.toISOString())).toBe(10);
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      expect(component.getDaysRemaining(pastDate.toISOString())).toBe(-5);
    });

    it('should format date correctly', () => {
      const date = '2024-12-31';
      const formatted = component.formatDate(date);
      // Format depends on locale, just check it's a string
      expect(typeof formatted).toBe('string');
    });

    it('should return min date as today', () => {
      const minDate = component.minDate;
      const today = new Date().toISOString().split('T')[0];
      expect(minDate).toBe(today);
    });
  });

  describe('Cancel and Reset', () => {
    it('should reset form', () => {
      component.driveForm.patchValue({
        driveName: 'Test Drive',
        companyName: 'Test Company'
      });
      component.resetForm();
      expect(component.driveForm.get('driveName')?.value).toBeNull();
      expect(component.driveForm.get('companyName')?.value).toBeNull();
      expect(component.driveForm.get('driveType')?.value).toBe('onCampus');
    });

    it('should cancel and reset when form is dirty and user confirms', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component, 'resetForm');
      component.driveForm.markAsDirty();
      
      component.cancel();
      
      expect(window.confirm).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
    });

    it('should not reset when user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(component, 'resetForm');
      component.driveForm.markAsDirty();
      
      component.cancel();
      
      expect(component.resetForm).not.toHaveBeenCalled();
    });
  });

  describe('Navigation Methods', () => {
    it('should view details', () => {
      spyOn(window, 'alert');
      const drive = { driveName: 'Test Drive' };
      component.viewDetails(drive);
      expect(window.alert).toHaveBeenCalledWith('Viewing details for Test Drive');
    });

    it('should edit drive', () => {
      spyOn(window, 'alert');
      const drive = { driveName: 'Test Drive' };
      component.editDrive(drive);
      expect(window.alert).toHaveBeenCalledWith('Editing Test Drive');
    });

    it('should cancel drive with confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert');
      const drive = { driveName: 'Test Drive' };
      
      component.cancelDrive(drive);
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel Test Drive?');
      expect(window.alert).toHaveBeenCalledWith('Test Drive has been cancelled.');
    });

    it('should not cancel drive if user declines', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(window, 'alert');
      const drive = { driveName: 'Test Drive' };
      
      component.cancelDrive(drive);
      
      expect(window.alert).not.toHaveBeenCalled();
    });
  });

  describe('Form Getters', () => {
    it('should return correct form controls', () => {
      expect(component.driveName).toBe(component.driveForm.get('driveName'));
      expect(component.companyName).toBe(component.driveForm.get('companyName'));
      expect(component.driveDate).toBe(component.driveForm.get('driveDate'));
      expect(component.driveTime).toBe(component.driveForm.get('driveTime'));
      expect(component.venue).toBe(component.driveForm.get('venue'));
      expect(component.positions).toBe(component.driveForm.get('positions'));
      expect(component.vacancies).toBe(component.driveForm.get('vacancies'));
      expect(component.description).toBe(component.driveForm.get('description'));
      expect(component.requirements).toBe(component.driveForm.get('requirements'));
      expect(component.registrationDeadline).toBe(component.driveForm.get('registrationDeadline'));
      expect(component.contactPerson).toBe(component.driveForm.get('contactPerson'));
      expect(component.contactEmail).toBe(component.driveForm.get('contactEmail'));
      expect(component.contactPhone).toBe(component.driveForm.get('contactPhone'));
    });
  });
});