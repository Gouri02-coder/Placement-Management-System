import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyListComponent } from './company-list.component';

describe('CompanyListComponent', () => {
  let component: CompanyListComponent;
  let fixture: ComponentFixture<CompanyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter companies by status', () => {
    component.selectedStatus = 'Pending';

    expect(component.filteredCompanies.every((company) => company.status === 'Pending')).toBeTrue();
  });
});
