import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ApplicationListComponent } from './application-list';

describe('ApplicationListComponent', () => {
  let component: ApplicationListComponent;
  let fixture: ComponentFixture<ApplicationListComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ApplicationListComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ companyId: 'company123' }));

    fixture = TestBed.createComponent(ApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with static applications', () => {
    expect(component).toBeTruthy();
    expect(component.applications.length).toBeGreaterThan(0);
    expect(component.filteredApplications.length).toBe(component.applications.length);
  });

  it('should filter applications by job title', () => {
    component.jobFilter = 'Frontend Developer';
    component.applyFilters();

    expect(component.filteredApplications.length).toBeGreaterThan(0);
    expect(component.filteredApplications.every(application => application.jobTitle === 'Frontend Developer')).toBeTrue();
  });

  it('should search applications by candidate name', () => {
    component.searchTerm = 'Aarav';
    component.searchApplications();

    expect(component.filteredApplications.length).toBe(1);
    expect(component.filteredApplications[0].candidateName).toBe('Aarav Mehta');
  });

  it('should update a single application status locally', () => {
    component.updateApplicationStatus('app_001', 'shortlisted');

    const updatedApplication = component.applications.find(application => application.id === 'app_001');
    expect(updatedApplication?.status).toBe('shortlisted');
  });

  it('should bulk update selected application statuses locally', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    component.selectedApplications.add('app_001');
    component.selectedApplications.add('app_002');

    component.bulkUpdateStatus('reviewed');

    const updatedApplications = component.applications.filter(application => ['app_001', 'app_002'].includes(application.id));
    expect(updatedApplications.every(application => application.status === 'reviewed')).toBeTrue();
    expect(window.alert).toHaveBeenCalledWith('Applications updated successfully!');
  });

  it('should clear filters back to defaults', () => {
    component.searchTerm = 'test';
    component.statusFilter = 'pending';
    component.jobFilter = 'Frontend Developer';
    component.branchFilter = 'Computer Science';
    component.minCGPAPicker = '8.0';

    component.clearFilters();

    expect(component.searchTerm).toBe('');
    expect(component.statusFilter).toBe('all');
    expect(component.jobFilter).toBe('all');
    expect(component.branchFilter).toBe('all');
    expect(component.minCGPAPicker).toBe('');
  });

  it('should navigate to candidate profile', () => {
    component.viewCandidateProfile('app_001');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/applications/candidate', 'app_001']);
  });

  it('should export locally generated files', () => {
    spyOn(component as never, 'downloadFile');

    component.exportToExcel();
    component.exportToPDF();

    expect((component as any).downloadFile).toHaveBeenCalledTimes(2);
  });
});
