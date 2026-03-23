import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentVerificationComponent } from './student-verification.component';

describe('StudentVerificationComponent', () => {
  let component: StudentVerificationComponent;
  let fixture: ComponentFixture<StudentVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentVerificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentVerificationComponent);
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
