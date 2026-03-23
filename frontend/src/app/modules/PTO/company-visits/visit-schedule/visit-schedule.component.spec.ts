import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitScheduleComponent } from './visit-schedule.component';

describe('VisitScheduleComponent', () => {
  let component: VisitScheduleComponent;
  let fixture: ComponentFixture<VisitScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitScheduleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitScheduleComponent);
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
