import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveCreateComponent } from './drive-create.component';

describe('DriveCreateComponent', () => {
  let component: DriveCreateComponent;
  let fixture: ComponentFixture<DriveCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveCreateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DriveCreateComponent);
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
