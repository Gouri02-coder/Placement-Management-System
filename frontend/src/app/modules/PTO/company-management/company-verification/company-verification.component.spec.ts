import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyVerificationComponent } from './company-verification.component';

describe('CompanyVerificationComponent', () => {
  let component: CompanyVerificationComponent;
  let fixture: ComponentFixture<CompanyVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyVerificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should approve a pending company', () => {
    component.approveCompany('CMP-102');

    expect(component.companies.find((company) => company.id === 'CMP-102')?.stage).toBe(
      'Approved'
    );
  });
});
