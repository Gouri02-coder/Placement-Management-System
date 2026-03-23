import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveSchedule } from './drive-schedule';

describe('DriveSchedule', () => {
  let component: DriveSchedule;
  let fixture: ComponentFixture<DriveSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriveSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
