import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompanyRoutingModule } from './company.route';

// Dashboard Components
import { CompanyDashboardComponent } from './components/company-dash-board/company-dash-board';
import { CompanyProfileComponent } from './components/company-profile/company-profile';

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

@NgModule({
    
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CompanyRoutingModule,

    CompanyDashboardComponent,
    CompanyProfileComponent,

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
export class CompanyModule { }
