import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, forkJoin } from 'rxjs';
import { DashboardStats, RecentActivity, ChartData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch all dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      students: this.http.get<any>(`${this.apiUrl}/students/stats`),
      companies: this.http.get<any>(`${this.apiUrl}/companies/stats`),
      placements: this.http.get<any>(`${this.apiUrl}/placements/stats`),
      drives: this.http.get<any>(`${this.apiUrl}/drives/upcoming/count`)
    }).pipe(
      map(({ students, companies, placements, drives }) => ({
        totalStudents: students.total || 0,
        studentsGrowth: students.growth || 0,
        totalCompanies: companies.total || 0,
        companiesGrowth: companies.growth || 0,
        openRoles: companies.openRoles || 0,
        rolesGrowth: companies.rolesGrowth || 0,
        placementsThisMonth: placements.thisMonth || 0,
        placementsGrowth: placements.growth || 0,
        pendingCompanyApprovals: companies.pendingApprovals || 0,
        pendingStudentVerifications: students.pendingVerifications || 0,
        upcomingDrives: drives.count || 0
      })),
      catchError(error => {
        console.error('Error fetching dashboard stats:', error);
        return of(this.getDefaultStats());
      })
    );
  }

  // Fetch recent activities
  getRecentActivities(limit: number = 5): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/activities/recent?limit=${limit}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching recent activities:', error);
          return of(this.getDefaultActivities());
        })
      );
  }

  // Fetch placement trends for charts
  getPlacementTrends(): Observable<ChartData> {
    return this.http.get<any>(`${this.apiUrl}/placements/trends`)
      .pipe(
        map(response => ({
          labels: response.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Placements',
            data: response.data || [65, 78, 82, 91, 105, 120],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: '#3b82f6'
          }]
        })),
        catchError(error => {
          console.error('Error fetching placement trends:', error);
          return of(this.getDefaultChartData());
        })
      );
  }

  // Fetch company distribution data
  getCompanyDistribution(): Observable<ChartData> {
    return this.http.get<any>(`${this.apiUrl}/companies/distribution`)
      .pipe(
        map(response => ({
          labels: response.labels || ['IT', 'Core Engineering', 'Consulting', 'Startups', 'Others'],
          datasets: [{
            label: 'Companies by Sector',
            data: response.data || [45, 28, 15, 8, 4],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(107, 114, 128, 0.8)'
            ]
          }]
        })),
        catchError(error => {
          console.error('Error fetching company distribution:', error);
          return of(this.getDefaultCompanyDistribution());
        })
      );
  }

  // Get quick actions with dynamic counts
  getQuickActions(): Observable<any[]> {
    return forkJoin({
      pendingCompanies: this.http.get<any>(`${this.apiUrl}/companies/pending/count`),
      pendingStudents: this.http.get<any>(`${this.apiUrl}/students/pending/count`)
    }).pipe(
      map(({ pendingCompanies, pendingStudents }) => [
        {
          id: 'view-students',
          title: 'VIEW ALL STUDENTS',
          route: '/pto/student-management/student-list',
          icon: 'users',
          color: 'blue',
          count: pendingStudents.count || 0,
          badge: 'Verified'
        },
        {
          id: 'view-companies',
          title: 'VIEW COMPANIES',
          route: '/pto/company-management/company-list',
          icon: 'building',
          color: 'green',
          badge: 'Verified'
        },
        {
          id: 'approve-companies',
          title: 'APPROVE COMPANIES',
          route: '/pto/company-management/company-verification',
          icon: 'check-circle',
          color: 'yellow',
          count: pendingCompanies.count || 0,
          badge: 'Pending'
        },
        {
          id: 'manage-drives',
          title: 'MANAGE DRIVES',
          route: '/pto/placement-drives/drive-list',
          icon: 'calendar',
          color: 'purple',
          badge: 'Managed'
        }
      ]),
      catchError(error => {
        console.error('Error fetching quick actions:', error);
        return of(this.getDefaultQuickActions());
      })
    );
  }

  // Default data methods for error handling
  private getDefaultStats(): DashboardStats {
    return {
      totalStudents: 0,
      studentsGrowth: 0,
      totalCompanies: 0,
      companiesGrowth: 0,
      openRoles: 0,
      rolesGrowth: 0,
      placementsThisMonth: 0,
      placementsGrowth: 0,
      pendingCompanyApprovals: 0,
      pendingStudentVerifications: 0,
      upcomingDrives: 0
    };
  }

  private getDefaultActivities(): RecentActivity[] {
    return [
      {
        id: '1',
        type: 'drive_scheduled',
        title: 'No recent activities',
        description: 'Activities will appear here',
        timestamp: new Date()
      }
    ];
  }

  private getDefaultChartData(): ChartData {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Placements',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6'
      }]
    };
  }

  private getDefaultCompanyDistribution(): ChartData {
    return {
      labels: ['IT', 'Core Engineering', 'Consulting', 'Startups', 'Others'],
      datasets: [{
        label: 'Companies by Sector',
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280']
      }]
    };
  }

  private getDefaultQuickActions(): any[] {
    return [
      {
        id: 'view-students',
        title: 'VIEW ALL STUDENTS',
        route: '/pto/student-management/student-list',
        icon: 'users',
        color: 'blue',
        count: 0,
        badge: 'Verified'
      },
      {
        id: 'view-companies',
        title: 'VIEW COMPANIES',
        route: '/pto/company-management/company-list',
        icon: 'building',
        color: 'green',
        badge: 'Verified'
      },
      {
        id: 'approve-companies',
        title: 'APPROVE COMPANIES',
        route: '/pto/company-management/company-verification',
        icon: 'check-circle',
        color: 'yellow',
        count: 0,
        badge: 'Pending'
      },
      {
        id: 'manage-drives',
        title: 'MANAGE DRIVES',
        route: '/pto/placement-drives/drive-list',
        icon: 'calendar',
        color: 'purple',
        badge: 'Managed'
      }
    ];
  }
}
