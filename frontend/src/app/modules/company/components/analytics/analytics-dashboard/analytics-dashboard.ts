import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CompanyDriveRecord,
  CompanyDriveRole,
  getCompanyAnalyticsActivities,
  getCompanyAnalyticsAlerts,
  getCompanyDrives,
  getCompanyPortalContext,
} from '../../../data/company-drive.data';

interface AnalyticsMetricState {
  activeDrives: number;
  liveRolePosts: number;
  totalApplications: number;
  totalInterviews: number;
  offerConversion: number;
  averagePackage: number;
}

interface TrendPoint {
  label: string;
  actual: number;
  target: number;
}

interface RoleLeaderboardEntry {
  title: string;
  driveCode: string;
  applications: number;
  offers: number;
  averagePackage: number;
  team: string;
}

interface PipelineEntry {
  label: string;
  applications: number;
  shortlisted: number;
  offered: number;
}

interface SkillDemandEntry {
  name: string;
  demand: number;
  growth: number;
}

interface DrivePerformanceEntry {
  name: string;
  roles: number;
  applications: number;
  offers: number;
  conversion: number;
  avgPackage: number;
}

interface ActivityEntry {
  id: number;
  candidateName: string;
  roleTitle: string;
  driveCode: string;
  branch: string;
  stage: string;
  updatedOn: string;
}

interface AlertEntry {
  id: number;
  type: 'success' | 'info' | 'warning';
  message: string;
  time: string;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.css',
})
export class AnalyticsDashboard implements OnInit {
  dateRange = 'month';
  customStartDate = '';
  customEndDate = '';
  isLoading = false;
  companyName = '';

  metrics: AnalyticsMetricState = {
    activeDrives: 0,
    liveRolePosts: 0,
    totalApplications: 0,
    totalInterviews: 0,
    offerConversion: 0,
    averagePackage: 0,
  };

  placementTrend: TrendPoint[] = [];
  topRoles: RoleLeaderboardEntry[] = [];
  drivePerformance: DrivePerformanceEntry[] = [];
  skillDemand: SkillDemandEntry[] = [];
  pipelineData: PipelineEntry[] = [];
  recentActivities: ActivityEntry[] = [];
  notifications: AlertEntry[] = [];

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadDashboardData();
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

    setTimeout(() => {
      const context = getCompanyPortalContext();
      const drives = getCompanyDrives();
      const roles = drives.flatMap((drive) =>
        drive.roles.map((role) => ({
          ...role,
          driveCode: drive.driveCode,
          driveName: drive.driveName,
          driveStatus: drive.status,
        }))
      );

      this.companyName = context.companyName;
      this.metrics = this.buildMetrics(drives, roles);
      this.placementTrend = this.buildTrendData();
      this.topRoles = this.buildRoleLeaderboard(roles);
      this.drivePerformance = this.buildDrivePerformance(drives);
      this.pipelineData = this.buildPipelineData(drives);
      this.skillDemand = this.buildSkillDemand(roles);
      this.recentActivities = getCompanyAnalyticsActivities();
      this.notifications = getCompanyAnalyticsAlerts(context.companyName);
      this.isLoading = false;
    }, 250);
  }

  private buildMetrics(
    drives: CompanyDriveRecord[],
    roles: Array<CompanyDriveRole & { driveCode: string; driveName: string; driveStatus: string }>
  ): AnalyticsMetricState {
    const activeDrives = drives.filter((drive) => drive.status === 'scheduled' || drive.status === 'ongoing').length;
    const liveRolePosts = roles.length;
    const totalApplications = roles.reduce((count, role) => count + role.applications, 0);
    const totalInterviews = roles.reduce((count, role) => count + role.interviews, 0);
    const totalOffers = roles.reduce((count, role) => count + role.offers, 0);
    const packageTotal = roles.reduce((count, role) => count + role.averagePackageLpa, 0);

    return {
      activeDrives,
      liveRolePosts,
      totalApplications,
      totalInterviews,
      offerConversion: totalApplications > 0 ? (totalOffers / totalApplications) * 100 : 0,
      averagePackage: roles.length > 0 ? packageTotal / roles.length : 0,
    };
  }

  private buildTrendData(): TrendPoint[] {
    return [
      { label: 'Jan', actual: 72, target: 65 },
      { label: 'Feb', actual: 88, target: 76 },
      { label: 'Mar', actual: 104, target: 92 },
      { label: 'Apr', actual: 116, target: 108 },
      { label: 'May', actual: 94, target: 90 },
      { label: 'Jun', actual: 102, target: 98 },
      { label: 'Jul', actual: 111, target: 104 },
      { label: 'Aug', actual: 97, target: 95 },
    ];
  }

  private buildRoleLeaderboard(
    roles: Array<CompanyDriveRole & { driveCode: string; driveName: string; driveStatus: string }>
  ): RoleLeaderboardEntry[] {
    return [...roles]
      .sort((left, right) => right.applications - left.applications)
      .slice(0, 5)
      .map((role) => ({
        title: role.title,
        driveCode: role.driveCode,
        applications: role.applications,
        offers: role.offers,
        averagePackage: role.averagePackageLpa,
        team: role.team,
      }));
  }

  private buildDrivePerformance(drives: CompanyDriveRecord[]): DrivePerformanceEntry[] {
    return drives.map((drive) => {
      const applications = drive.roles.reduce((count, role) => count + role.applications, 0);
      const offers = drive.roles.reduce((count, role) => count + role.offers, 0);
      const packageAverage =
        drive.roles.reduce((count, role) => count + role.averagePackageLpa, 0) / Math.max(drive.roles.length, 1);

      return {
        name: drive.driveName,
        roles: drive.roles.length,
        applications,
        offers,
        conversion: applications > 0 ? (offers / applications) * 100 : 0,
        avgPackage: packageAverage,
      };
    });
  }

  private buildPipelineData(drives: CompanyDriveRecord[]): PipelineEntry[] {
    return drives.map((drive) => ({
      label: drive.driveCode,
      applications: drive.roles.reduce((count, role) => count + role.applications, 0),
      shortlisted: drive.roles.reduce((count, role) => count + role.shortlisted, 0),
      offered: drive.roles.reduce((count, role) => count + role.offers, 0),
    }));
  }

  private buildSkillDemand(
    roles: Array<CompanyDriveRole & { driveCode: string; driveName: string; driveStatus: string }>
  ): SkillDemandEntry[] {
    const totals = new Map<string, number>();

    roles.forEach((role) => {
      role.skills.forEach((skill) => {
        totals.set(skill, (totals.get(skill) ?? 0) + role.applications);
      });
    });

    const maxDemand = Math.max(...Array.from(totals.values()), 1);

    return Array.from(totals.entries())
      .map(([name, total], index) => ({
        name,
        demand: Math.round((total / maxDemand) * 100),
        growth: 6 + ((index * 4) % 19),
      }))
      .sort((left, right) => right.demand - left.demand)
      .slice(0, 8);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  changeDateRange(range: string): void {
    this.dateRange = range;
    this.loadDashboardData();
  }

  getTrendMaxValue(): number {
    return Math.max(...this.placementTrend.map((item) => Math.max(item.actual, item.target)), 1);
  }

  getTrendY(value: number): number {
    return 90 - (value / this.getTrendMaxValue()) * 70;
  }

  getTrendPoints(key: 'actual' | 'target'): string {
    if (this.placementTrend.length === 0) {
      return '';
    }

    const step = this.placementTrend.length > 1 ? 100 / (this.placementTrend.length - 1) : 100;
    return this.placementTrend
      .map((item, index) => `${(index * step).toFixed(2)},${this.getTrendY(item[key]).toFixed(2)}`)
      .join(' ');
  }

  getAreaPoints(): string {
    const linePoints = this.getTrendPoints('actual');
    return `0,90 ${linePoints} 100,90`;
  }

  getPipelineMaxValue(): number {
    return Math.max(
      ...this.pipelineData.map((item) => Math.max(item.applications, item.shortlisted, item.offered)),
      1
    );
  }

  getMonthlyBarHeight(value: number): number {
    return (value / this.getPipelineMaxValue()) * 100;
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  formatPackage(value: number): string {
    return `INR ${value.toFixed(1)}L`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getGrowthClass(growth: number): string {
    return growth >= 0 ? 'positive' : 'negative';
  }

  getDemandClass(demand: number): string {
    if (demand >= 70) {
      return 'high';
    }

    if (demand >= 50) {
      return 'medium';
    }

    return 'low';
  }

  getBranchClass(rate: number): string {
    if (rate >= 14) {
      return 'excellent';
    }

    if (rate >= 9) {
      return 'good';
    }

    if (rate >= 5) {
      return 'average';
    }

    return 'poor';
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'notifications';
    }
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'info':
        return 'notification-info';
      case 'warning':
        return 'notification-warning';
      case 'error':
        return 'notification-error';
      default:
        return 'notification-default';
    }
  }
}
