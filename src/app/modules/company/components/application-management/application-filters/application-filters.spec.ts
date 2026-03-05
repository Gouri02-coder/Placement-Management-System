import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFilters } from './application-filters';

describe('ApplicationFilters', () => {
  let component: ApplicationFilters;
  let fixture: ComponentFixture<ApplicationFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
