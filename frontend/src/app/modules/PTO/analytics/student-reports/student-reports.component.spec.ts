import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReportsComponent } from './student-reports.component';

describe('StudentReportsComponent', () => {
  let component: StudentReportsComponent;
  let fixture: ComponentFixture<StudentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentReportsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose section metrics', () => {
    expect(component.metrics.length).toBe(3);
  });
});
