import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Reports } from './reports';

describe('Reports', () => {
  let component: Reports;
  let fixture: ComponentFixture<Reports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should set default dates', () => {
      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
    });

    it('should load report data', () => {
      expect(component.stats.totalApplications).toBeGreaterThan(0);
    });
  });

  describe('Date Range', () => {
    it('should generate report with valid dates', () => {
      spyOn(window, 'alert');
      component.startDate = '2024-01-01';
      component.endDate = '2024-12-31';
      component.generateReport();
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('should show alert if start date is missing', () => {
      spyOn(window, 'alert');
      component.startDate = '';
      component.generateReport();
      expect(window.alert).toHaveBeenCalledWith('Please select both start and end dates');
    });

    it('should show alert if start date is after end date', () => {
      spyOn(window, 'alert');
      component.startDate = '2024-12-31';
      component.endDate = '2024-01-01';
      component.generateReport();
      expect(window.alert).toHaveBeenCalledWith('Start date cannot be after end date');
    });
  });

  describe('Tabs', () => {
    it('should change tab', () => {
      component.changeTab('applications');
      expect(component.activeTab).toBe('applications');
      
      component.changeTab('departments');
      expect(component.activeTab).toBe('departments');
    });
  });

  describe('Helper Methods', () => {
    it('should format number', () => {
      expect(component.formatNumber(1000)).toBe('1,000');
      expect(component.formatNumber(1234567)).toBe('1,234,567');
    });

    it('should get status color', () => {
      expect(component.getStatusColor('pending')).toBe('#f59e0b');
      expect(component.getStatusColor('shortlisted')).toBe('#10b981');
      expect(component.getStatusColor('unknown')).toBe('#6b7280');
    });

    it('should get placement rate class', () => {
      component.stats.placementRate = 85;
      expect(component.getPlacementRateClass()).toBe('rate-excellent');
      
      component.stats.placementRate = 60;
      expect(component.getPlacementRateClass()).toBe('rate-good');
      
      component.stats.placementRate = 40;
      expect(component.getPlacementRateClass()).toBe('rate-average');
      
      component.stats.placementRate = 20;
      expect(component.getPlacementRateClass()).toBe('rate-poor');
    });
  });

  describe('Export', () => {
    it('should export report', () => {
      spyOn(window, 'alert');
      component.exportReport('excel');
      expect(window.alert).toHaveBeenCalled();
    });
  });
});