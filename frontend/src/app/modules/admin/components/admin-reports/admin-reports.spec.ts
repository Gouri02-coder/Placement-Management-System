import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReports } from './admin-reports';

describe('AdminReports', () => {
  let component: AdminReports;
  let fixture: ComponentFixture<AdminReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReports]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should download a csv report with proper details for Excel', () => {
    component.selectedFormat = 'Excel';
    const downloadSpy = spyOn(component, 'downloadBlob');

    component.downloadReport();

    expect(downloadSpy).toHaveBeenCalled();
    const [blob, filename] = downloadSpy.calls.mostRecent().args as [Blob, string];
    expect(blob.type).toContain('text/csv');
    expect(filename).toContain('admin-placement-report-');
    expect(filename.endsWith('.csv')).toBeTrue();
    expect(component.message).toContain('Downloaded Excel report');
  });

  it('should download a pdf report with proper details for PDF', () => {
    component.selectedFormat = 'PDF';
    const downloadSpy = spyOn(component, 'downloadBlob');

    component.downloadReport();

    expect(downloadSpy).toHaveBeenCalled();
    const [blob, filename] = downloadSpy.calls.mostRecent().args as [Blob, string];
    expect(blob.type).toBe('application/pdf');
    expect(filename.endsWith('.pdf')).toBeTrue();
    expect(component.message).toContain('summary, students, companies, approvals, and drive details');
  });
});
