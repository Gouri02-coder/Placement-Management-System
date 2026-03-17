import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFiltersComponent } from './application-filters';

describe('ApplicationFiltersComponent', () => {
  let component: ApplicationFiltersComponent;
  let fixture: ComponentFixture<ApplicationFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
