import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentForm } from './student-form';

describe('StudentForm', () => {
  let component: StudentForm;
  let fixture: ComponentFixture<StudentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.student.personalInfo.fullName).toBe('');
    expect(component.student.academicInfo.cgpa).toBe(0);
  });

  it('should add skill to skills list', () => {
    component.student.newSkill = 'Angular';
    component.addSkill();
    expect(component.student.skills).toContain('Angular');
  });

  it('should remove skill from skills list', () => {
    component.student.skills = ['JavaScript', 'TypeScript'];
    component.removeSkill('JavaScript');
    expect(component.student.skills).not.toContain('JavaScript');
  });

  it('should validate form correctly', () => {
    component.loadSampleData();
    expect(component.validateForm()).toBe(true);
  });
});