import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ShortlistCandidatesComponent } from './shortlist-candidates';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/application.model';
import { of, throwError } from 'rxjs';

describe('ShortlistCandidatesComponent', () => {
  let component: ShortlistCandidatesComponent;
  let fixture: ComponentFixture<ShortlistCandidatesComponent>;
  let mockApplicationService: jasmine.SpyObj<ApplicationService>;

  // Complete mock applications matching the Application interface
  const mockApplications: Application[] = [
    {
      id: 'app_001',
      jobId: 'job_001',
      jobTitle: 'Frontend Developer',
      studentId: 'stud_001',
      candidateName: 'John Doe',
      candidateEmail: 'john.doe@example.com',
      candidatePhone: '+91 9876543210',
      branch: 'Computer Science',
      cgpa: 8.5,
      yearOfPassing: 2024,
      skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'RxJS'],
      resumeUrl: 'https://example.com/resumes/john_doe.pdf',
      coverLetter: 'I am passionate about frontend development and have experience building scalable web applications.',
      status: 'shortlisted',
      appliedAt: new Date('2024-03-15T10:30:00'),
      updatedAt: new Date('2024-03-20T14:45:00')
    },
    {
      id: 'app_002',
      jobId: 'job_002',
      jobTitle: 'Backend Developer',
      studentId: 'stud_002',
      candidateName: 'Jane Smith',
      candidateEmail: 'jane.smith@example.com',
      candidatePhone: '+91 9876543211',
      branch: 'Information Technology',
      cgpa: 7.8,
      yearOfPassing: 2024,
      skills: ['Node.js', 'Python', 'SQL', 'MongoDB', 'Express', 'Docker'],
      resumeUrl: 'https://example.com/resumes/jane_smith.pdf',
      coverLetter: 'Experienced backend developer with strong database management skills.',
      status: 'shortlisted',
      appliedAt: new Date('2024-03-14T09:15:00'),
      updatedAt: new Date('2024-03-19T11:20:00')
    },
    {
      id: 'app_003',
      jobId: 'job_001',
      jobTitle: 'Frontend Developer',
      studentId: 'stud_003',
      candidateName: 'Mike Johnson',
      candidateEmail: 'mike.johnson@example.com',
      candidatePhone: '+91 9876543212',
      branch: 'Computer Science',
      cgpa: 9.2,
      yearOfPassing: 2024,
      skills: ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'Redux', 'Next.js', 'Tailwind CSS'],
      resumeUrl: 'https://example.com/resumes/mike_johnson.pdf',
      coverLetter: 'Creative frontend developer with a keen eye for design and user experience.',
      status: 'shortlisted',
      appliedAt: new Date('2024-03-13T14:20:00'),
      updatedAt: new Date('2024-03-18T16:30:00')
    },
    {
      id: 'app_004',
      jobId: 'job_003',
      jobTitle: 'Full Stack Developer',
      studentId: 'stud_004',
      candidateName: 'Sarah Williams',
      candidateEmail: 'sarah.williams@example.com',
      candidatePhone: '+91 9876543213',
      branch: 'Electronics & Communication',
      cgpa: 8.0,
      yearOfPassing: 2023,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
      resumeUrl: 'https://example.com/resumes/sarah_williams.pdf',
      coverLetter: 'Full stack developer with 2 years of internship experience.',
      status: 'shortlisted',
      appliedAt: new Date('2024-03-12T11:45:00'),
      updatedAt: new Date('2024-03-17T09:15:00')
    },
    {
      id: 'app_005',
      jobId: 'job_002',
      jobTitle: 'Backend Developer',
      studentId: 'stud_005',
      candidateName: 'Alex Kumar',
      candidateEmail: 'alex.kumar@example.com',
      candidatePhone: '+91 9876543214',
      branch: 'Information Technology',
      cgpa: 8.8,
      yearOfPassing: 2024,
      skills: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'REST APIs', 'Microservices'],
      resumeUrl: 'https://example.com/resumes/alex_kumar.pdf',
      coverLetter: 'Java backend developer with strong OOP concepts.',
      status: 'shortlisted',
      appliedAt: new Date('2024-03-11T08:30:00'),
      updatedAt: new Date('2024-03-16T13:45:00')
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApplicationService', ['getApplicationsByCompany', 'updateApplicationStatus']);

    await TestBed.configureTestingModule({
      imports: [ShortlistCandidatesComponent, FormsModule],
      providers: [
        { provide: ApplicationService, useValue: spy }
      ]
    }).compileComponents();

    mockApplicationService = TestBed.inject(ApplicationService) as jasmine.SpyObj<ApplicationService>;
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ companyId: 'company123' }));
    
    fixture = TestBed.createComponent(ShortlistCandidatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load shortlisted candidates on init', () => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      
      fixture.detectChanges();
      
      expect(mockApplicationService.getApplicationsByCompany).toHaveBeenCalledWith('company123', { status: 'shortlisted' });
      expect(component.shortlistedApplications.length).toBe(5);
    });

    it('should handle error when loading candidates', () => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(throwError(() => new Error('Network error')));
      
      fixture.detectChanges();
      
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('Filters', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should filter by search term (name)', () => {
      component.searchTerm = 'John';
      component.applyFilters();
      expect(component.filteredApplications.length).toBe(1);
      expect(component.filteredApplications[0].candidateName).toBe('John Doe');
    });

    it('should filter by search term (email)', () => {
      component.searchTerm = 'jane.smith@example.com';
      component.applyFilters();
      expect(component.filteredApplications.length).toBe(1);
      expect(component.filteredApplications[0].candidateName).toBe('Jane Smith');
    });

    it('should filter by search term (job title)', () => {
      component.searchTerm = 'Full Stack';
      component.applyFilters();
      expect(component.filteredApplications.length).toBe(1);
      expect(component.filteredApplications[0].jobTitle).toBe('Full Stack Developer');
    });

    it('should filter by job filter', () => {
      component.selectedJobFilter = 'Frontend Developer';
      component.applyFilters();
      expect(component.filteredApplications.length).toBe(2);
      expect(component.filteredApplications[0].jobTitle).toBe('Frontend Developer');
      expect(component.filteredApplications[1].jobTitle).toBe('Frontend Developer');
    });

    it('should combine search and job filter', () => {
      component.searchTerm = 'Mike';
      component.selectedJobFilter = 'Frontend Developer';
      component.applyFilters();
      expect(component.filteredApplications.length).toBe(1);
      expect(component.filteredApplications[0].candidateName).toBe('Mike Johnson');
    });
  });

  describe('Candidate Actions', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should remove candidate from shortlist', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      // ✅ Fix: Return an Observable of the updated application
      const updatedApplication = { ...mockApplications[0], status: 'reviewed' as const };
      mockApplicationService.updateApplicationStatus.and.returnValue(of(updatedApplication));
      
      const initialCount = component.shortlistedApplications.length;
      component.removeFromShortlist('app_001');
      
      expect(mockApplicationService.updateApplicationStatus).toHaveBeenCalledWith({
        applicationId: 'app_001',
        status: 'reviewed'
      });
      expect(component.shortlistedApplications.length).toBe(initialCount - 1);
    });

    it('should not remove candidate if user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      const initialCount = component.shortlistedApplications.length;
      component.removeFromShortlist('app_001');
      
      expect(mockApplicationService.updateApplicationStatus).not.toHaveBeenCalled();
      expect(component.shortlistedApplications.length).toBe(initialCount);
    });

    it('should hire candidate', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      // ✅ Fix: Return an Observable of the updated application
      const updatedApplication = { ...mockApplications[0], status: 'hired' as const };
      mockApplicationService.updateApplicationStatus.and.returnValue(of(updatedApplication));
      
      const initialCount = component.shortlistedApplications.length;
      component.hireCandidate('app_001');
      
      expect(mockApplicationService.updateApplicationStatus).toHaveBeenCalledWith({
        applicationId: 'app_001',
        status: 'hired'
      });
      expect(component.shortlistedApplications.length).toBe(initialCount - 1);
    });

    it('should view resume', () => {
      spyOn(window, 'open');
      component.viewResume('https://example.com/resumes/john_doe.pdf');
      expect(window.open).toHaveBeenCalledWith('https://example.com/resumes/john_doe.pdf', '_blank');
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should get skill level correctly', () => {
      expect(component.getSkillLevel(['skill1', 'skill2'])).toBe('beginner');
      expect(component.getSkillLevel(['skill1', 'skill2', 'skill3'])).toBe('intermediate');
      expect(component.getSkillLevel(['skill1', 'skill2', 'skill3', 'skill4', 'skill5'])).toBe('advanced');
      expect(component.getSkillLevel(['skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'skill6', 'skill7', 'skill8'])).toBe('expert');
    });

    it('should get skill level class', () => {
      expect(component.getSkillLevelClass(['skill1', 'skill2'])).toBe('skill-level-beginner');
      expect(component.getSkillLevelClass(['skill1', 'skill2', 'skill3'])).toBe('skill-level-intermediate');
    });

    it('should get unique jobs', () => {
      const uniqueJobs = component.getUniqueJobs();
      expect(uniqueJobs.length).toBe(3);
      expect(uniqueJobs).toContain('Frontend Developer');
      expect(uniqueJobs).toContain('Backend Developer');
      expect(uniqueJobs).toContain('Full Stack Developer');
    });

    it('should get average CGPA', () => {
      const avgCGPA = component.getAverageCGPA();
      const expectedAvg = (8.5 + 7.8 + 9.2 + 8.0 + 8.8) / 5;
      expect(avgCGPA).toBe(parseFloat(expectedAvg.toFixed(2)));
    });

    it('should get total candidates', () => {
      expect(component.getTotalCandidates()).toBe(5);
    });

    it('should get hiring progress', () => {
      expect(component.getHiringProgress()).toBe(65);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should calculate total pages', () => {
      component.itemsPerPage = 2;
      // ✅ Fix: Call applyFilters instead of private calculateTotalPages
      component.applyFilters(); // This triggers calculateTotalPages internally
      expect(component.totalPages).toBe(3);
    });

    it('should return paginated applications', () => {
      component.itemsPerPage = 2;
      component.applyFilters(); // This triggers calculateTotalPages internally
      component.currentPage = 1;
      expect(component.paginatedApplications.length).toBe(2);
      
      component.currentPage = 2;
      expect(component.paginatedApplications.length).toBe(2);
      
      component.currentPage = 3;
      expect(component.paginatedApplications.length).toBe(1);
    });

    it('should change page', () => {
      component.totalPages = 5;
      component.changePage(3);
      expect(component.currentPage).toBe(3);
      
      component.changePage(6);
      expect(component.currentPage).toBe(3);
      
      component.changePage(0);
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

  describe('Export Functionality', () => {
    beforeEach(() => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of(mockApplications));
      fixture.detectChanges();
    });

    it('should export to CSV', () => {
      spyOn(window, 'URL').and.callThrough();
      const createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
      const revokeObjectURLSpy = spyOn(window.URL, 'revokeObjectURL');
      
      component.exportToCSV();
      
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty shortlist', () => {
      mockApplicationService.getApplicationsByCompany.and.returnValue(of([]));
      fixture.detectChanges();
      
      expect(component.shortlistedApplications.length).toBe(0);
      expect(component.getAverageCGPA()).toBe(0);
      expect(component.getUniqueJobs().length).toBe(0);
    });

    it('should handle undefined skills', () => {
      const applicationWithoutSkills = { ...mockApplications[0], skills: undefined };
      component.shortlistedApplications = [applicationWithoutSkills as any];
      expect(component.getSkillLevel(undefined as any)).toBe('beginner');
    });

    it('should handle null resume URL', () => {
      const applicationWithoutResume = { ...mockApplications[0], resumeUrl: '' };
      component.shortlistedApplications = [applicationWithoutResume as any];
      // ✅ Fix: Pass empty string instead of null
      expect(() => component.viewResume(applicationWithoutResume.resumeUrl)).not.toThrow();
    });
  });
});