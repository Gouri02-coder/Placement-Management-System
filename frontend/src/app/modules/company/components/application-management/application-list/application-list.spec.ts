import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ApplicationListComponent } from './application-list';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/application.model';

describe('ApplicationListComponent', () => {
  let component: ApplicationListComponent;
  let fixture: ComponentFixture<ApplicationListComponent>;
  let mockApplicationService: jasmine.SpyObj<ApplicationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockApplications: Application[] = [
    {
      id: 'app_001',
      jobId: 'job_001',
      jobTitle: 'Frontend Developer',
      studentId: 'stud_001',
      candidateName: 'John Doe',
      candidateEmail: 'john@example.com',
      candidatePhone: '+91 9876543210',
      branch: 'Computer Science',
      cgpa: 8.5,
      yearOfPassing: 2024,
      skills: ['Angular', 'TypeScript', 'JavaScript'],
      resumeUrl: 'https://example.com/resume.pdf',
      status: 'pending',
      appliedAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'app_002',
      jobId: 'job_002',
      jobTitle: 'Backend Developer',
      studentId: 'stud_002',
      candidateName: 'Jane Smith',
      candidateEmail: 'jane@example.com',
      candidatePhone: '+91 9876543211',
      branch: 'Information Technology',
      cgpa: 7.8,
      yearOfPassing: 2024,
      skills: ['Node.js', 'Python', 'SQL'],
      resumeUrl: 'https://example.com/resume2.pdf',
      status: 'shortlisted',
      appliedAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockUpdatedApplication: Application = {
    ...mockApplications[0],
    status: 'shortlisted'
  };

  beforeEach(async () => {
    const appServiceSpy = jasmine.createSpyObj('ApplicationService', [
      'getApplicationsByCompany',
      'updateApplicationStatus',
      'bulkUpdateApplicationStatus',
      'downloadApplicationsExcel',
      'downloadApplicationsPDF'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [ApplicationListComponent, FormsModule],
      providers: [
        { provide: ApplicationService, useValue: appServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockApplicationService = TestBed.inject(ApplicationService) as jasmine.SpyObj<ApplicationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ companyId: 'company123' }));
    
    fixture = TestBed.createComponent(ApplicationListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load applications on init', () => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      
      fixture.detectChanges();
      
      expect(mockApplicationService.getApplicationsByCompany).toHaveBeenCalled();
      expect(component.applications.length).toBe(2);
    });

    it('should handle error when loading applications', () => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(throwError(() => new Error('Network error')));
      
      fixture.detectChanges();
      
      expect(component.isLoading).toBeFalse();
      expect(component.applications).toEqual([]);
    });
  });

  describe('Filters', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should apply filters', () => {
      component.jobFilter = 'Frontend Developer';
      component.applyFilters();
      expect(component.filters.jobId).toBe('Frontend Developer');
    });

    it('should search applications', () => {
      component.searchTerm = 'John';
      component.searchApplications();
      expect(component.filteredApplications.length).toBe(1);
      expect(component.filteredApplications[0].candidateName).toBe('John Doe');
    });
  });

  describe('Selection', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
      // Set filteredApplications instead of paginatedApplications (which is readonly)
      component.filteredApplications = mockApplications;
      component.itemsPerPage = 10;
      component.applyFilters();
    });

    it('should toggle application selection', () => {
      component.toggleApplicationSelection('app_001');
      expect(component.selectedApplications.has('app_001')).toBeTrue();
      
      component.toggleApplicationSelection('app_001');
      expect(component.selectedApplications.has('app_001')).toBeFalse();
    });

    it('should toggle select all', () => {
      component.toggleSelectAll();
      expect(component.selectedCount).toBe(2);
      
      component.toggleSelectAll();
      expect(component.selectedCount).toBe(0);
    });
  });

  describe('Bulk Actions', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
      component.selectedApplications.add('app_001');
      component.selectedApplications.add('app_002');
    });

    it('should bulk update status', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      // ✅ Fix: Return Observable<void> or Observable<any>
      mockApplicationService.bulkUpdateApplicationStatus.and.returnValue(of(undefined));
      
      component.bulkUpdateStatus('shortlisted');
      
      expect(mockApplicationService.bulkUpdateApplicationStatus).toHaveBeenCalledWith(
        ['app_001', 'app_002'], 'shortlisted'
      );
    });

    it('should show alert when no applications selected', () => {
      spyOn(window, 'alert');
      component.selectedApplications.clear();
      
      component.bulkUpdateStatus('shortlisted');
      
      expect(window.alert).toHaveBeenCalledWith('Please select at least one application.');
    });

    it('should not update if user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.bulkUpdateStatus('shortlisted');
      
      expect(mockApplicationService.bulkUpdateApplicationStatus).not.toHaveBeenCalled();
    });
  });

  describe('Status Updates', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should update single application status', () => {
      spyOn(window, 'alert');
      // ✅ Fix: Return Observable of the updated application
      mockApplicationService.updateApplicationStatus.and.returnValue(of(mockUpdatedApplication));
      
      component.updateApplicationStatus('app_001', 'shortlisted');
      
      expect(mockApplicationService.updateApplicationStatus).toHaveBeenCalledWith({
        applicationId: 'app_001',
        status: 'shortlisted'
      });
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.filteredApplications = mockApplications;
      component.itemsPerPage = 1;
      // ✅ Fix: Call applyFilters instead of private calculateTotalPages
      component.applyFilters(); // This will call calculateTotalPages internally
    });

    it('should calculate total pages', () => {
      expect(component.totalPages).toBe(2);
    });

    it('should return paginated applications', () => {
      component.currentPage = 1;
      expect(component.paginatedApplications.length).toBe(1);
      
      component.currentPage = 2;
      expect(component.paginatedApplications.length).toBe(1);
    });

    it('should change page', () => {
      component.totalPages = 5;
      component.changePage(2);
      expect(component.currentPage).toBe(2);
      
      component.changePage(6);
      expect(component.currentPage).toBe(2);
    });

    it('should generate page numbers', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([3, 4, 5, 6, 7]);
    });

    it('should get start index', () => {
      component.currentPage = 1;
      component.itemsPerPage = 10;
      expect(component.getStartIndex()).toBe(1);
      
      component.currentPage = 2;
      expect(component.getStartIndex()).toBe(11);
    });

    it('should get end index', () => {
      component.filteredApplications = mockApplications;
      component.currentPage = 1;
      component.itemsPerPage = 10;
      expect(component.getEndIndex()).toBe(2);
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should get status class', () => {
      expect(component.getStatusClass('pending')).toBe('status-pending');
      expect(component.getStatusClass('shortlisted')).toBe('status-shortlisted');
      expect(component.getStatusClass('reviewed')).toBe('status-reviewed');
      expect(component.getStatusClass('rejected')).toBe('status-rejected');
      expect(component.getStatusClass('hired')).toBe('status-hired');
      expect(component.getStatusClass(undefined)).toBe('status-pending');
    });

    it('should get status icon', () => {
      expect(component.getStatusIcon('pending')).toBe('schedule');
      expect(component.getStatusIcon('shortlisted')).toBe('star');
      expect(component.getStatusIcon('reviewed')).toBe('visibility');
      expect(component.getStatusIcon('rejected')).toBe('cancel');
      expect(component.getStatusIcon('hired')).toBe('check_circle');
      expect(component.getStatusIcon(undefined)).toBe('schedule');
    });

    it('should get unique jobs', () => {
      const jobs = component.getUniqueJobs();
      expect(jobs.length).toBe(2);
      expect(jobs).toContain('Frontend Developer');
      expect(jobs).toContain('Backend Developer');
    });

    it('should get unique branches', () => {
      const branches = component.getUniqueBranches();
      expect(branches.length).toBe(2);
      expect(branches).toContain('Computer Science');
      expect(branches).toContain('Information Technology');
    });

    it('should clear filters', () => {
      component.searchTerm = 'test';
      component.statusFilter = 'pending';
      component.jobFilter = 'Frontend Developer';
      component.branchFilter = 'Computer Science';
      component.minCGPAPicker = '7.5';
      
      component.clearFilters();
      
      expect(component.searchTerm).toBe('');
      expect(component.statusFilter).toBe('all');
      expect(component.jobFilter).toBe('all');
      expect(component.branchFilter).toBe('all');
      expect(component.minCGPAPicker).toBe('');
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should view candidate profile', () => {
      component.viewCandidateProfile('app_001');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/applications/candidate', 'app_001']);
    });

    it('should view resume', () => {
      spyOn(window, 'open');
      component.viewResume(mockApplications[0]);
      expect(window.open).toHaveBeenCalledWith(mockApplications[0].resumeUrl, '_blank');
    });

    it('should show alert if resume not available', () => {
      spyOn(window, 'alert');
      component.viewResume({ ...mockApplications[0], resumeUrl: String(undefined) });
      expect(window.alert).toHaveBeenCalledWith('Resume not available.');
    });
  });

  describe('Export', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should export to Excel', () => {
      const blob = new Blob(['test'], { type: 'application/vnd.ms-excel' });
      mockApplicationService.downloadApplicationsExcel.and.returnValue(of(blob));
      spyOn(component as any, 'downloadFile');
      
      component.exportToExcel();
      
      expect(mockApplicationService.downloadApplicationsExcel).toHaveBeenCalled();
    });

    it('should export to PDF', () => {
      const blob = new Blob(['test'], { type: 'application/pdf' });
      mockApplicationService.downloadApplicationsPDF.and.returnValue(of(blob));
      spyOn(component as any, 'downloadFile');
      
      component.exportToPDF();
      
      expect(mockApplicationService.downloadApplicationsPDF).toHaveBeenCalled();
    });

    it('should handle export error', () => {
      spyOn(window, 'alert');
      mockApplicationService.downloadApplicationsExcel.and.returnValue(throwError(() => new Error('Export failed')));
      
      component.exportToExcel();
      
      expect(window.alert).toHaveBeenCalledWith('Error exporting applications. Please try again.');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty applications list', () => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of([]));
      fixture.detectChanges();
      
      expect(component.applications.length).toBe(0);
      expect(component.filteredApplications.length).toBe(0);
      expect(component.getUniqueJobs()).toEqual([]);
      expect(component.getUniqueBranches()).toEqual([]);
    });

    it('should handle undefined application in search', () => {
      component.applications = [undefined as any];
      component.searchTerm = 'test';
      component.searchApplications();
      expect(component.filteredApplications.length).toBe(0);
    });
  });
});