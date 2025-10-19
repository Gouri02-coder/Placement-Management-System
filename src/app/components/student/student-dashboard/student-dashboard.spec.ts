import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentDashboard } from './student-dashboard';
import { CommonModule } from '@angular/common';

describe('StudentDashboard', () => {
  let component: StudentDashboard;
  let fixture: ComponentFixture<StudentDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDashboard, CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default stats', () => {
    expect(component.stats.applied).toBe(12);
    expect(component.stats.interviews).toBe(3);
    expect(component.stats.offers).toBe(1);
    expect(component.stats.profile).toBe(85);
  });

  it('should apply to job and update stats', () => {
    const initialApplied = component.stats.applied;
    const jobId = component.recentJobs[0].id;
    
    component.applyToJob(jobId);
    
    expect(component.stats.applied).toBe(initialApplied + 1);
  });

  it('should format dates correctly', () => {
    const date = component.formatDate('2024-02-15');
    expect(date).toBe('February 15, 2024');
  });
});