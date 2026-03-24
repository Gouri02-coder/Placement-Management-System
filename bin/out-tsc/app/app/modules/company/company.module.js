import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompanyRoutingModule } from './company.route';
// Dashboard Components
import { CompanyDashboardComponent } from './components/company-dash-board/company-dash-board';
import { CompanyProfileComponent } from './components/company-profile/company-profile';
// Job Management Components
import { JobPostingsComponent } from './components/company-jobs/job-postings/job-postings';
import { JobListComponent } from './components/company-jobs/job-list/job-list';
import { JobCreateComponent } from './components/company-jobs/job-create/job-create';
import { JobEditComponent } from './components/company-jobs/job-edit/job-edit';
// Application Management Components
import { ApplicationListComponent } from './components/application-management/application-list/application-list';
import { CandidateProfileComponent } from './components/application-management/candidate-profile/candidate-profile';
import { ApplicationFiltersComponent } from './components/application-management/application-filters/application-filters';
import { ShortlistCandidatesComponent } from './components/application-management/shortlist-candidates/shortlist-candidates';
// Services
import { CompanyService } from './services/company.service';
import { JobService } from './services/job.service';
import { ApplicationService } from './services/application.service';
import { DriveService } from './services/drive.service';
import { AnalyticsService } from './services/analytics.service';
let CompanyModule = class CompanyModule {
};
CompanyModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            FormsModule,
            RouterModule,
            CompanyRoutingModule,
            CompanyDashboardComponent,
            CompanyProfileComponent,
            // Job Management
            JobPostingsComponent,
            JobListComponent,
            JobCreateComponent,
            JobEditComponent,
            // Application Management
            ApplicationListComponent,
            CandidateProfileComponent,
            ApplicationFiltersComponent,
            ShortlistCandidatesComponent
        ],
        providers: [
            CompanyService,
            JobService,
            ApplicationService,
            DriveService,
            AnalyticsService
        ]
    })
], CompanyModule);
export { CompanyModule };
