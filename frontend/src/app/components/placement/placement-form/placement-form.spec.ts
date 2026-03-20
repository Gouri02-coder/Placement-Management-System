import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementForm } from './placement-form';

describe('PlacementForm', () => {
  let component: PlacementForm;
  let fixture: ComponentFixture<PlacementForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
