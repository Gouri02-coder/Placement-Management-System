import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyApproval } from './company-approval';

describe('CompanyApproval', () => {
  let component: CompanyApproval;
  let fixture: ComponentFixture<CompanyApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
