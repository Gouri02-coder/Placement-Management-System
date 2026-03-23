import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pto-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pto-dashboard.component.html',
  styleUrls: ['./pto-dashboard.component.css']
})
export class PtoDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('placementChart') placementChartRef!: ElementRef;
  @ViewChild('distributionChart') distributionChartRef!: ElementRef;

  // Stats Data
  stats = {
    totalStudents: 1284,
    placements: 73,
    activeCompanies: 86,
    upcomingDrives: 4
  };

  // Live Updates Data
  recentActivities = [
    { 
      title: 'Placement Drive Scheduled', 
      description: 'Nexora Labs recruitment drive scheduled for March 25th', 
      user: 'System', time: '15 min ago', icon: '📅', colorClass: 'bg-blue' 
    },
    { 
      title: 'Company Verified', 
      description: 'ByteCraft Technologies completed verification process', 
      user: 'Admin', time: '1 hour ago', icon: '🏢', colorClass: 'bg-green' 
    },
    { 
      title: 'Report Exported', 
      description: 'Monthly placement report exported', 
      user: 'PTO Officer', time: '3 hours ago', icon: '📊', colorClass: 'bg-purple' 
    },
    { 
      title: 'New Student Registrations', 
      description: '45 new students registered for placement drive', 
      user: 'System', time: '6 hours ago', icon: '👥', colorClass: 'bg-orange' 
    },
    { 
      title: 'Placements Confirmed', 
      description: '12 students placed at TechCorp Solutions', 
      user: 'Company', time: '1 day ago', icon: '🎯', colorClass: 'bg-teal' 
    }
  ];

  private chart1: any;
  private chart2: any;

  ngOnInit(): void {}

  // We use AfterViewInit so the Canvas elements exist before we try to draw on them
  ngAfterViewInit(): void {
    this.initCharts();
  }

  refreshData(): void {
    console.log("Refreshing dashboard data...");
    // Add API refresh logic here
  }

  initCharts(): void {
    // 1. Line Chart
    const ctx1 = this.placementChartRef.nativeElement.getContext('2d');
    this.chart1 = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Placements',
          data: [42, 58, 67, 83, 94, 112, 128, 145, 162, 178, 195, 214],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          tension: 0.1,
          fill: true,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#3b82f6',
          pointBorderWidth: 2,
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { dash: [4, 4] } },
          x: { grid: { display: false } }
        }
      }
    });

    // 2. Doughnut Chart
    const ctx2 = this.distributionChartRef.nativeElement.getContext('2d');
    this.chart2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['IT Services', 'Fintech', 'E-commerce', 'Healthcare', 'Manufacturing'],
        datasets: [{
          data: [45, 28, 18, 15, 22],
          backgroundColor: ['#3b82f6', '#ec489a', '#f59e0b', '#8b5cf6', '#10b981'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8 } }
        }
      }
    });
  }
}