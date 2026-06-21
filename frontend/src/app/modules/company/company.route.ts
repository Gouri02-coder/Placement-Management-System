import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyLayoutComponent } from '../../layouts/company-layout/company-layout';
import { CompanyDashboardComponent } from './components/company-dash-board/company-dash-board';
import { CompanyProfileComponent } from './components/company-profile/company-profile';
import { ApplicationListComponent } from './components/application-management/application-list/application-list';
import { CandidateProfileComponent } from './components/application-management/candidate-profile/candidate-profile';
import { ShortlistCandidatesComponent } from './components/application-management/shortlist-candidates/shortlist-candidates';
import { DriveList } from './components/placement-drive/drive-list/drive-list';
import { ScheduleDrive } from './components/placement-drive/schedule-drive/schedule-drive';
import { DriveDetails } from './components/placement-drive/drive-details/drive-details';
import { AnalyticsDashboard } from './components/analytics/analytics-dashboard/analytics-dashboard';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    component: CompanyLayoutComponent,
    children: [
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
        pathMatch: 'full',
        redirectTo: 'drives'
      },
      {
        path: 'jobs/create',
        pathMatch: 'full',
        redirectTo: 'drives/schedule'
      },
      {
        path: 'jobs/edit/:id',
        pathMatch: 'full',
        redirectTo: 'drives/details/:id'
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
      {
        path: 'drives',
        component: DriveList
      },
      {
        path: 'drives/schedule',
        component: ScheduleDrive
      },
      {
        path: 'drives/details/:id',
        component: DriveDetails
      },
      {
        path: 'analytics',
        component: AnalyticsDashboard
      }
    ]
  }
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
