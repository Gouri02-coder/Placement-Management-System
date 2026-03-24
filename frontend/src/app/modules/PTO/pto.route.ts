import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { PtoLayoutComponent } from './pto-layout/pto-layout.component';
import { PtoDashboardComponent } from './pto-dashboard/pto-dashboard.component';
import { CompanyDetailsComponent } from './company-management/company-details/company-details.component';
import { CompanyListComponent } from './company-management/company-list/company-list.component';
import { CompanyVerificationComponent } from './company-management/company-verification/company-verification.component';
import { VisitListComponent } from './company-visits/visit-list/visit-list.component';
import { VisitReportComponent } from './company-visits/visit-report/visit-report.component';
import { VisitScheduleComponent } from './company-visits/visit-schedule/visit-schedule.component';
import { DriveCreateComponent } from './placement-drives/drive-create/drive-create.component';
import { DriveDetailsComponent } from './placement-drives/drive-details/drive-details.component';
import { DriveListComponent } from './placement-drives/drive-list/drive-list.component';
import { StudentDetailsComponent } from './student-management/student-details/student-details.component';
import { StudentListComponent } from './student-management/student-list/student-list.component';
import { StudentVerificationComponent } from './student-management/student-verification/student-verification.component';
import { CompanyReportsComponent } from './analytics/company-reports/company-reports.component';
import { PlacementStatsComponent } from './analytics/placement-stats/placement-stats.component';
import { StudentReportsComponent } from './analytics/student-reports/student-reports.component';

export const PTO_ROUTES: Routes = [
  {
    path: '',
    component: PtoLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['pto'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: PtoDashboardComponent
      },
      {
        path: 'student-management',
        children: [
          {
            path: 'student-list',
            component: StudentListComponent
          },
          {
            path: 'student-details/:id',
            component: StudentDetailsComponent
          },
          {
            path: 'student-verification',
            component: StudentVerificationComponent
          }
        ]
      },
      {
        path: 'company-management',
        children: [
          {
            path: 'company-list',
            component: CompanyListComponent
          },
          {
            path: 'company-details/:id',
            component: CompanyDetailsComponent
          },
          {
            path: 'company-verification',
            component: CompanyVerificationComponent
          }
        ]
      },
      {
        path: 'placement-drives',
        children: [
          {
            path: 'drive-list',
            component: DriveListComponent
          },
          {
            path: 'drive-create',
            component: DriveCreateComponent
          },
          {
            path: 'drive-details/:id',
            component: DriveDetailsComponent
          }
        ]
      },
      {
        path: 'company-visits',
        children: [
          {
            path: 'visit-list',
            component: VisitListComponent
          },
          {
            path: 'visit-schedule',
            component: VisitScheduleComponent
          },
          {
            path: 'visit-report/:id',
            component: VisitReportComponent
          }
        ]
      },
      {
        path: 'analytics',
        children: [
          {
            path: 'company-reports',
            component: CompanyReportsComponent
          },
          {
            path: 'placement-stats',
            component: PlacementStatsComponent
          },
          {
            path: 'student-reports',
            component: StudentReportsComponent
          }
        ]
      }
    ]
  }
];