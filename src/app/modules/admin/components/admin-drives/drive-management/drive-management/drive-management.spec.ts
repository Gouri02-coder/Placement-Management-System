import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveManagement } from './drive-management';

describe('DriveManagement', () => {
  let component: DriveManagement;
  let fixture: ComponentFixture<DriveManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriveManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
