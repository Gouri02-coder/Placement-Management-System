import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementStatsComponent } from './placement-stats.component';

describe('PlacementStatsComponent', () => {
  let component: PlacementStatsComponent;
  let fixture: ComponentFixture<PlacementStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementStatsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlacementStatsComponent);
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
