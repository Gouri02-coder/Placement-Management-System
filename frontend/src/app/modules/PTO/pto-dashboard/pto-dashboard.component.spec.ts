import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoDashboardComponent } from './pto-dashboard.component';

describe('PtoDashboardComponent', () => {
  let component: PtoDashboardComponent;
  let fixture: ComponentFixture<PtoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PtoDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PtoDashboardComponent);
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
