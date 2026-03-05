import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementDetails } from './placement-details';

describe('PlacementDetails', () => {
  let component: PlacementDetails;
  let fixture: ComponentFixture<PlacementDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
