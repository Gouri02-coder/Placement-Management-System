import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementList } from './placement-list';

describe('PlacementList', () => {
  let component: PlacementList;
  let fixture: ComponentFixture<PlacementList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
