import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDrive } from './schedule-drive';

describe('ScheduleDrive', () => {
  let component: ScheduleDrive;
  let fixture: ComponentFixture<ScheduleDrive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDrive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDrive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
