import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentDetails } from './student-details';

describe('StudentDetails', () => {
  let component: StudentDetails;
  let fixture: ComponentFixture<StudentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have student data after initialization', () => {
    expect(component.student).toBeDefined();
    expect(component.student.personalInfo.fullName).toBeTruthy();
  });

  it('should generate correct avatar initials', () => {
    const initials = component.getAvatarInitials();
    expect(initials).toBe('JS');
  });

  it('should format date correctly', () => {
    const formattedDate = component.formatDate('2024-01-15');
    expect(formattedDate).toMatch(/\w+ \d{1,2}, \d{4}/);
  });
});