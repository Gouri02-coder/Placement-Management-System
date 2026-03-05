import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyDashboardComponent } from './components/company-dash-board/company-dash-board';
import { CompanyProfileComponent } from './components/company-profile/company-profile';
import { JobPostingsComponent } from './components/company-jobs/job-postings/job-postings';
import { JobListComponent } from './components/company-jobs/job-list/job-list';
import { JobCreateComponent } from './components/company-jobs/job-create/job-create';
import { JobEditComponent } from './components/company-jobs/job-edit/job-edit';
import { ApplicationListComponent } from './components/application-management/application-list/application-list';
import { CandidateProfileComponent } from './components/application-management/candidate-profile/candidate-profile';
import { ShortlistCandidatesComponent } from './components/application-management/shortlist-candidates/shortlist-candidates';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: CompanyDashboardComponent
  },
  {
    path: 'profile',
    component: CompanyProfileComponent
  },
  {
    path: 'jobs',
    component: JobPostingsComponent,
    children: [
      {
        path: '',
        component: JobListComponent
      },
      {
        path: 'create',
        component: JobCreateComponent
      },
      {
        path: 'edit/:id',
        component: JobEditComponent
      }
    ]
  },
  
  {
    path: 'applications',
    component: ApplicationListComponent
  },
  {
    path: 'applications/candidate/:id',
    component: CandidateProfileComponent
  },
  {
    path: 'applications/shortlisted',
    component: ShortlistCandidatesComponent
  },
  // {
  //   path: 'drives',
  //   component: PlacementDriveComponent,
  //   children: [
  //     { path: '', component: DriveListComponent },
  //     { path: 'schedule', component: ScheduleDriveComponent },
  //     { path: 'details/:id', component: DriveDetailsComponent }
  //   ]
  // },
  // {
  //   path: 'analytics',
  //   component: AnalyticsComponent,
  //   children: [
  //     { path: '', component: AnalyticsDashboardComponent },
  //     { path: 'reports', component: ReportsComponent }
  //   ]
  // },
  // {
  //   path: 'communication',
  //   component: CommunicationComponent,
  //   children: [
  //     { path: '', component: NotificationsComponent },
  //     { path: 'messaging', component: MessagingComponent }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(COMPANY_ROUTES)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }