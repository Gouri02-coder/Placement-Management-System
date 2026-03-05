import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistCandidates } from './shortlist-candidates';

describe('ShortlistCandidates', () => {
  let component: ShortlistCandidates;
  let fixture: ComponentFixture<ShortlistCandidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortlistCandidates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortlistCandidates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
