import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
let CompanyDashboardComponent = class CompanyDashboardComponent {
    router;
    companyService;
    userName = '';
    userRole = 'HR Manager';
    activeSection = 'dashboard';
    companyProfile = {
        id: '',
        name: '',
        logo: '',
        website: '',
        address: '',
        description: '',
        hrContact: {
            name: '',
            email: '',
            phone: '',
            position: ''
        },
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    dashboardStats = {
        activeJobs: 0,
        totalApplications: 0,
        localHires: 0,
        pendingReviews: 0,
        upcomingDrives: 0,
        unreadNotifications: 0
    };
    recentActivities = [
        {
            type: 'success',
            icon: 'check_circle',
            message: 'Job "Frontend Developer" published successfully',
            time: '2 hours ago'
        },
        {
            type: 'info',
            icon: 'info',
            message: '5 new applications received for "Data Analyst" position',
            time: '5 hours ago'
        },
        {
            type: 'warning',
            icon: 'warning',
            message: '3 applications pending review for over 7 days',
            time: '1 day ago'
        }
    ];
    constructor(router, companyService) {
        this.router = router;
        this.companyService = companyService;
    }
    ngOnInit() {
        this.loadUserData();
        this.loadCompanyProfile();
        this.loadCompanyStats();
    }
    loadUserData() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            const user = JSON.parse(userData);
            this.userName = user.name;
            this.userRole = user.role || 'HR Manager';
        }
    }
    loadCompanyProfile() {
        const companyId = this.getCompanyId();
        this.companyService.getCompanyProfile(companyId).subscribe({
            next: (profile) => {
                this.companyProfile = profile;
            },
            error: (error) => {
                console.error('Error loading company profile:', error);
            }
        });
    }
    loadCompanyStats() {
        const companyId = this.getCompanyId();
        this.companyService.getCompanyStats(companyId).subscribe({
            next: (stats) => {
                this.dashboardStats = stats;
            },
            error: (error) => {
                console.error('Error loading company stats:', error);
            }
        });
    }
    getCompanyId() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData).companyId : '';
    }
    switchSection(section) {
        this.activeSection = section;
        const routes = {
            dashboard: '/company/dashboard',
            profile: '/company/profile',
            jobs: '/company/jobs',
            applications: '/company/applications',
            drives: '/company/drives',
            analytics: '/company/analytics',
            communication: '/company/communication'
        };
        if (routes[section]) {
            this.router.navigate([routes[section]]);
        }
    }
    postJob() {
        this.router.navigate(['/company/jobs/post']);
    }
    manageJobs() {
        this.router.navigate(['/company/jobs']);
    }
    viewApplications() {
        this.router.navigate(['/company/applications']);
    }
    scheduleDrive() {
        this.router.navigate(['/company/drives/schedule']);
    }
    viewAnalytics() {
        this.router.navigate(['/company/analytics']);
    }
    editProfile() {
        this.router.navigate(['/company/profile']);
    }
    viewNotifications() {
        this.router.navigate(['/company/notifications']);
    }
    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
    }
    getStatusClass(status) {
        return `status-${status}`;
    }
    getNotificationCount() {
        return this.dashboardStats.unreadNotifications;
    }
    // Screenshot feature simulation
    takeScreenshot() {
        console.log('Taking screenshot of dashboard...');
        // In a real implementation, this would use html2canvas or similar library
        alert('Screenshot feature would capture the current dashboard view');
    }
};
CompanyDashboardComponent = __decorate([
    Component({
        selector: 'app-company-dashboard',
        standalone: true,
        imports: [CommonModule, RouterOutlet],
        templateUrl: './company-dash-board.html',
        styleUrls: ['./company-dash-board.css']
    })
], CompanyDashboardComponent);
export { CompanyDashboardComponent };
