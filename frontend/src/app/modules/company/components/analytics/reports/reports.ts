import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  // Date range
  startDate: string = '';
  endDate: string = '';
  reportType: string = 'applications';
  isLoading = false;
  
  // Statistics
  stats = {
    totalApplications: 0,
    totalShortlisted: 0,
    totalHired: 0,
    totalRejected: 0,
    activeJobs: 0,
    totalCompanies: 0,
    averageCGPA: 0,
    placementRate: 0
  };
  
  // Chart data
  applicationChart: any;
  statusChart: any;
  departmentChart: any;
  
  // Tab data
  activeTab: string = 'overview';
  
  // Recent activities
  recentActivities: any[] = [];
  
  // Top performing departments
  topDepartments: any[] = [];
  
  // Monthly data
  monthlyData: any[] = [];
  
  constructor() {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadReportData();
  }

  private setDefaultDates(): void {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    this.startDate = lastMonth.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  loadReportData(): void {
    this.isLoading = true;
    
    // Simulate API call - replace with actual service
    setTimeout(() => {
      // Mock statistics
      this.stats = {
        totalApplications: 245,
        totalShortlisted: 78,
        totalHired: 45,
        totalRejected: 122,
        activeJobs: 12,
        totalCompanies: 8,
        averageCGPA: 8.2,
        placementRate: 68.5
      };
      
      // Mock recent activities
      this.recentActivities = [
        { id: 1, type: 'application', title: 'New application received', description: 'John Doe applied for Frontend Developer', time: '2 minutes ago', icon: 'description', color: '#3b82f6' },
        { id: 2, type: 'shortlist', title: 'Candidate shortlisted', description: 'Jane Smith was shortlisted for Backend Developer', time: '1 hour ago', icon: 'star', color: '#10b981' },
        { id: 3, type: 'hired', title: 'Candidate hired', description: 'Mike Johnson accepted the offer for Full Stack Developer', time: '3 hours ago', icon: 'check_circle', color: '#8b5cf6' },
        { id: 4, type: 'drive', title: 'New drive scheduled', description: 'Tech Mahindra campus drive scheduled for April 15', time: '5 hours ago', icon: 'event', color: '#f59e0b' },
        { id: 5, type: 'interview', title: 'Interview completed', description: 'Interview round completed for 5 candidates', time: '1 day ago', icon: 'record_voice_over', color: '#ef4444' }
      ];
      
      // Mock top departments
      this.topDepartments = [
        { name: 'Computer Science', applications: 89, shortlisted: 32, hired: 18, rate: 20.2 },
        { name: 'Information Technology', applications: 67, shortlisted: 24, hired: 14, rate: 20.9 },
        { name: 'Electronics & Communication', applications: 45, shortlisted: 12, hired: 6, rate: 13.3 },
        { name: 'Data Science', applications: 28, shortlisted: 8, hired: 5, rate: 17.9 },
        { name: 'Mechanical Engineering', applications: 16, shortlisted: 2, hired: 2, rate: 12.5 }
      ];
      
      // Mock monthly data
      this.monthlyData = [
        { month: 'Jan', applications: 25, shortlisted: 8, hired: 4 },
        { month: 'Feb', applications: 32, shortlisted: 10, hired: 5 },
        { month: 'Mar', applications: 45, shortlisted: 14, hired: 8 },
        { month: 'Apr', applications: 38, shortlisted: 12, hired: 7 },
        { month: 'May', applications: 42, shortlisted: 15, hired: 9 },
        { month: 'Jun', applications: 35, shortlisted: 11, hired: 6 },
        { month: 'Jul', applications: 28, shortlisted: 8, hired: 4 },
        { month: 'Aug', applications: 0, shortlisted: 0, hired: 0 },
        { month: 'Sep', applications: 0, shortlisted: 0, hired: 0 },
        { month: 'Oct', applications: 0, shortlisted: 0, hired: 0 },
        { month: 'Nov', applications: 0, shortlisted: 0, hired: 0 },
        { month: 'Dec', applications: 0, shortlisted: 0, hired: 0 }
      ];
      
      this.isLoading = false;
      
      // Initialize charts after data is loaded
      setTimeout(() => {
        this.initCharts();
      }, 100);
    }, 1000);
  }

  private initCharts(): void {
    this.initApplicationChart();
    this.initStatusChart();
    this.initDepartmentChart();
  }

  private initApplicationChart(): void {
    const ctx = document.getElementById('applicationChart') as HTMLCanvasElement;
    if (ctx) {
      this.applicationChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.monthlyData.map(d => d.month),
          datasets: [
            {
              label: 'Applications',
              data: this.monthlyData.map(d => d.applications),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Shortlisted',
              data: this.monthlyData.map(d => d.shortlisted),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Hired',
              data: this.monthlyData.map(d => d.hired),
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Applications'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          }
        }
      });
    }
  }

  private initStatusChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (ctx) {
      this.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Shortlisted', 'Hired', 'Rejected', 'Pending'],
          datasets: [{
            data: [
              this.stats.totalShortlisted,
              this.stats.totalHired,
              this.stats.totalRejected,
              this.stats.totalApplications - (this.stats.totalShortlisted + this.stats.totalHired + this.stats.totalRejected)
            ],
            backgroundColor: ['#10b981', '#8b5cf6', '#ef4444', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }

  private initDepartmentChart(): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    if (ctx) {
      this.departmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.topDepartments.map(d => d.name),
          datasets: [
            {
              label: 'Applications',
              data: this.topDepartments.map(d => d.applications),
              backgroundColor: '#3b82f6',
              borderRadius: 8
            },
            {
              label: 'Shortlisted',
              data: this.topDepartments.map(d => d.shortlisted),
              backgroundColor: '#10b981',
              borderRadius: 8
            },
            {
              label: 'Hired',
              data: this.topDepartments.map(d => d.hired),
              backgroundColor: '#8b5cf6',
              borderRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Candidates'
              }
            }
          }
        }
      });
    }
  }

  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    if (new Date(this.startDate) > new Date(this.endDate)) {
      alert('Start date cannot be after end date');
      return;
    }
    
    this.loadReportData();
  }

  exportReport(format: string): void {
    alert(`Exporting report as ${format.toUpperCase()} for period ${this.startDate} to ${this.endDate}`);
    // Implement actual export logic here
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': '#f59e0b',
      'reviewed': '#3b82f6',
      'shortlisted': '#10b981',
      'hired': '#8b5cf6',
      'rejected': '#ef4444'
    };
    return colors[status] || '#6b7280';
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  getPlacementRateClass(): string {
    if (this.stats.placementRate >= 70) return 'rate-excellent';
    if (this.stats.placementRate >= 50) return 'rate-good';
    if (this.stats.placementRate >= 30) return 'rate-average';
    return 'rate-poor';
  }
}