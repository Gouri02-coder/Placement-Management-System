import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentList } from './student-list';

describe('StudentList', () => {
  let component: StudentList;
  let fixture: ComponentFixture<StudentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with students', () => {
    expect(component.students.length).toBeGreaterThan(0);
    expect(component.filteredStudents.length).toBe(component.students.length);
  });

  it('should filter students by search term', () => {
    component.searchTerm = 'john';
    component.onSearch();
    expect(component.filteredStudents.length).toBeLessThan(component.students.length);
  });

  it('should delete student', () => {
    const initialLength = component.students.length;
    component.deleteStudent(1);
    expect(component.students.length).toBe(initialLength - 1);
  });
});