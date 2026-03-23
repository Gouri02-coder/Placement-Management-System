import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AnalyticsDashboard } from './analytics-dashboard';

describe('AnalyticsDashboard', () => {
  let component: AnalyticsDashboard;
  let fixture: ComponentFixture<AnalyticsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsDashboard, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load dashboard data', () => {
      expect(component.metrics.totalPlacements).toBeGreaterThan(0);
      expect(component.topCompanies.length).toBeGreaterThan(0);
    });
  });

  describe('Date Range', () => {
    it('should change date range', () => {
      component.changeDateRange('week');
      expect(component.dateRange).toBe('week');
    });
  });

  describe('Helper Methods', () => {
    it('should format number', () => {
      expect(component.formatNumber(1000)).toBe('1,000');
    });

    it('should format salary', () => {
      expect(component.formatSalary(850000)).toBe('₹8.5L');
      expect(component.formatSalary(18000000)).toBe('₹1.8Cr');
    });

    it('should format date', () => {
      const result = component.formatDate('2024-03-15');
      expect(result).toBeTruthy();
    });

    it('should get growth icon', () => {
      expect(component.getGrowthIcon(10)).toBe('trending_up');
      expect(component.getGrowthIcon(-5)).toBe('trending_down');
    });

    it('should get demand class', () => {
      expect(component.getDemandClass(85)).toBe('high');
      expect(component.getDemandClass(60)).toBe('medium');
      expect(component.getDemandClass(40)).toBe('low');
    });

    it('should get branch class', () => {
      expect(component.getBranchClass(70)).toBe('excellent');
      expect(component.getBranchClass(50)).toBe('good');
      expect(component.getBranchClass(30)).toBe('average');
      expect(component.getBranchClass(15)).toBe('poor');
    });

    it('should get notification icon', () => {
      expect(component.getNotificationIcon('success')).toBe('check_circle');
      expect(component.getNotificationIcon('info')).toBe('info');
      expect(component.getNotificationIcon('warning')).toBe('warning');
    });
  });

  describe('Refresh', () => {
    it('should refresh data', () => {
      component.refreshData();
      expect(component.isLoading).toBeTrue();
    });
  });
});