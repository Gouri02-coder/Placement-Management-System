import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.css',
})
export class AnalyticsDashboard implements OnInit {
  // Date range
  dateRange: string = 'month';
  customStartDate: string = '';
  customEndDate: string = '';
  isLoading = false;
  
  // Dashboard metrics
  metrics = {
    totalPlacements: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    placementRate: 0,
    averageSalary: 0,
    topPerformingBranch: '',
    growthRate: 0
  };
  
  // Charts data
  placementTrend: any[] = [];
  topCompanies: any[] = [];
  branchPerformance: any[] = [];
  skillDemand: any[] = [];
  monthlyData: any[] = [];
  
  // Recent placements
  recentPlacements: any[] = [];
  
  // Notifications
  notifications: any[] = [];
  
  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.setDefaultDates();
  }

  private setDefaultDates(): void {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    this.customStartDate = lastMonth.toISOString().split('T')[0];
    this.customEndDate = today.toISOString().split('T')[0];
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Simulate API call - replace with actual service
    setTimeout(() => {
      // Metrics
      this.metrics = {
        totalPlacements: 342,
        totalCompanies: 28,
        totalJobs: 156,
        totalApplications: 2450,
        placementRate: 68.5,
        averageSalary: 850000,
        topPerformingBranch: 'Computer Science',
        growthRate: 15.8
      };
      
      // Placement Trend (last 12 months)
      this.placementTrend = [
        { month: 'Jan', placements: 28, target: 25 },
        { month: 'Feb', placements: 32, target: 30 },
        { month: 'Mar', placements: 45, target: 40 },
        { month: 'Apr', placements: 38, target: 42 },
        { month: 'May', placements: 52, target: 48 },
        { month: 'Jun', placements: 48, target: 50 },
        { month: 'Jul', placements: 42, target: 45 },
        { month: 'Aug', placements: 35, target: 38 },
        { month: 'Sep', placements: 0, target: 0 },
        { month: 'Oct', placements: 0, target: 0 },
        { month: 'Nov', placements: 0, target: 0 },
        { month: 'Dec', placements: 0, target: 0 }
      ];
      
      // Top Companies
      this.topCompanies = [
        { name: 'Tech Mahindra', logo: 'TM', placements: 28, avgSalary: 720000 },
        { name: 'Infosys', logo: 'INF', placements: 24, avgSalary: 680000 },
        { name: 'Amazon', logo: 'AMZ', placements: 18, avgSalary: 1450000 },
        { name: 'TCS', logo: 'TCS', placements: 32, avgSalary: 580000 },
        { name: 'Microsoft', logo: 'MS', placements: 12, avgSalary: 1800000 },
        { name: 'Google', logo: 'GOOG', placements: 8, avgSalary: 2200000 }
      ];
      
      // Branch Performance
      this.branchPerformance = [
        { name: 'Computer Science', placements: 142, students: 210, rate: 67.6, avgSalary: 950000 },
        { name: 'Information Technology', placements: 98, students: 145, rate: 67.6, avgSalary: 890000 },
        { name: 'Electronics & Comm', placements: 52, students: 95, rate: 54.7, avgSalary: 780000 },
        { name: 'Data Science', placements: 28, students: 45, rate: 62.2, avgSalary: 1020000 },
        { name: 'Mechanical', placements: 12, students: 35, rate: 34.3, avgSalary: 620000 },
        { name: 'Civil', placements: 8, students: 28, rate: 28.6, avgSalary: 580000 }
      ];
      
      // Skill Demand
      this.skillDemand = [
        { name: 'JavaScript', demand: 85, growth: 12 },
        { name: 'Python', demand: 78, growth: 15 },
        { name: 'React', demand: 72, growth: 18 },
        { name: 'Node.js', demand: 65, growth: 10 },
        { name: 'SQL', demand: 58, growth: 5 },
        { name: 'AWS', demand: 52, growth: 22 },
        { name: 'Angular', demand: 48, growth: 8 },
        { name: 'Machine Learning', demand: 45, growth: 25 }
      ];
      
      // Monthly Data for charts
      this.monthlyData = [
        { month: 'Jan', applications: 185, shortlisted: 52, hired: 28 },
        { month: 'Feb', applications: 210, shortlisted: 58, hired: 32 },
        { month: 'Mar', applications: 245, shortlisted: 72, hired: 45 },
        { month: 'Apr', applications: 228, shortlisted: 65, hired: 38 },
        { month: 'May', applications: 268, shortlisted: 82, hired: 52 },
        { month: 'Jun', applications: 242, shortlisted: 75, hired: 48 },
        { month: 'Jul', applications: 215, shortlisted: 68, hired: 42 },
        { month: 'Aug', applications: 0, shortlisted: 0, hired: 0 }
      ];
      
      // Recent Placements
      this.recentPlacements = [
        { id: 1, name: 'John Doe', company: 'Tech Mahindra', package: '₹8.5 LPA', date: '2024-03-15', branch: 'Computer Science' },
        { id: 2, name: 'Jane Smith', company: 'Infosys', package: '₹6.8 LPA', date: '2024-03-14', branch: 'Information Technology' },
        { id: 3, name: 'Mike Johnson', company: 'Amazon', package: '₹14.5 LPA', date: '2024-03-12', branch: 'Computer Science' },
        { id: 4, name: 'Sarah Williams', company: 'TCS', package: '₹5.8 LPA', date: '2024-03-10', branch: 'Electronics' },
        { id: 5, name: 'Alex Kumar', company: 'Microsoft', package: '₹18.0 LPA', date: '2024-03-08', branch: 'Data Science' }
      ];
      
      // Notifications
      this.notifications = [
        { id: 1, type: 'success', message: 'Placement milestone achieved! 300+ students placed this year.', time: '2 hours ago' },
        { id: 2, type: 'info', message: 'New company registered: Google is coming for campus drive.', time: '5 hours ago' },
        { id: 3, type: 'warning', message: 'Registration deadline approaching for Tech Mahindra drive.', time: '1 day ago' },
        { id: 4, type: 'success', message: 'Average salary increased by 12% compared to last year.', time: '2 days ago' }
      ];
      
      this.isLoading = false;
    }, 1000);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  changeDateRange(range: string): void {
    this.dateRange = range;
    this.loadDashboardData();
  }

  getMaxPlacements(): number {
    return Math.max(...this.placementTrend.map(p => p.placements), 1);
  }

  getBarHeight(placements: number): number {
    const max = this.getMaxPlacements();
    return (placements / max) * 100;
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  formatSalary(salary: number): string {
    if (salary >= 10000000) {
      return `₹${(salary / 10000000).toFixed(1)}Cr`;
    } else if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L`;
    }
    return `₹${salary.toLocaleString()}`;
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getGrowthIcon(growth: number): string {
    return growth >= 0 ? 'trending_up' : 'trending_down';
  }

  getGrowthClass(growth: number): string {
    return growth >= 0 ? 'positive' : 'negative';
  }

  getDemandClass(demand: number): string {
    if (demand >= 70) return 'high';
    if (demand >= 50) return 'medium';
    return 'low';
  }

  getBranchClass(rate: number): string {
    if (rate >= 60) return 'excellent';
    if (rate >= 40) return 'good';
    if (rate >= 20) return 'average';
    return 'poor';
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'notifications';
    }
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case 'success': return 'notification-success';
      case 'info': return 'notification-info';
      case 'warning': return 'notification-warning';
      case 'error': return 'notification-error';
      default: return 'notification-default';
    }
  }
}