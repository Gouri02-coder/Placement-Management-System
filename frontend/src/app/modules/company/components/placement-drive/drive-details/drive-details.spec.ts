import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveDetails } from './drive-details';

describe('DriveDetails', () => {
  let component: DriveDetails;
  let fixture: ComponentFixture<DriveDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriveDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
