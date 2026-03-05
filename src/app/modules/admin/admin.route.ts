import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';

// Admin Components
import { AdminDashboard } from '../admin/components/admin-dashboard/admin-dashboard/admin-dashboard';
import { CompanyList } from '../admin/components/admin-companies/company-list/company-list';
import { CompanyDetails } from '../admin/components/admin-companies/company-details/company-details/company-details';
import { CompanyApproval } from '../admin/components/admin-companies/company-approval/company-approval/company-approval';
import { DriveManagement } from '../admin/components/admin-drives/drive-management/drive-management/drive-management';
import { DriveSchedule } from '../admin/components/admin-drives/drive-schedule/drive-schedule';
import { AdminReports } from '../admin/components/admin-reports/admin-reports';
import { StudentList } from '../admin/components/admin-students/student-list/student-list';
import { StudentDetails } from '../admin/components/admin-students/student-details/student-details';
import { AdminLayout } from '../admin/components/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboard,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'placement-officer'] }
      },
      {
        path: 'companies',
        children: [
          {
            path: '',
            component: CompanyList,
            canActivate: [AuthGuard, RoleGuard],
            data: { roles: ['admin', 'placement-officer'] }
          },
          {
            path: 'details/:id',
            component: CompanyDetails,
            canActivate: [AuthGuard, RoleGuard],
            data: { roles: ['admin', 'placement-officer'] }
          },
          {
            path: 'approval',
            component: CompanyApproval,
            canActivate: [AuthGuard, RoleGuard],
            data: { roles: ['admin'] }
          }
        ]
      },
      {
        path: 'drives',
        children: [
         
          {
            path: 'management',
            component: DriveManagement,
            canActivate: [AuthGuard, RoleGuard],
            data: { roles: ['admin', 'placement-officer'] }
          },
          {
            path: 'schedule',
            component: DriveSchedule,
            canActivate: [AuthGuard, RoleGuard],
            data: { roles: ['admin', 'placement-officer'] }
          }
        ]
      },
      {
        path: 'students',
        children: [
          
          {
            path: 'list',
            component: StudentList,
            canActivate: [AuthGuard, RoleGuard],
            data: { roles: ['admin', 'placement-officer'] }
          },
          {
            path: 'details/:id',
            component: StudentDetails,
            canActivate: [AuthGuard, RoleGuard],
            data: { roles: ['admin', 'placement-officer'] }
          }
        ]
      },
      {
        path: 'reports',
        component: AdminReports,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'placement-officer'] }
      },
      
    ]
  }
];