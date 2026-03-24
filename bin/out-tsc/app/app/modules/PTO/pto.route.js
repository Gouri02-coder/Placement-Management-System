import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { CompanyVerificationComponent } from './components/company-verification/company-verification';
import { PlacementMonitorComponent } from './components/placement-monitor/placement-monitor';
import { PtoDashboardComponent } from './components/pto-dashboard/pto-dashboard';
import { StudentVerificationComponent } from './components/student-verification/student-verification';
export const PTO_ROUTES = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: PtoDashboardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['placement-officer', 'admin'] }
    },
    {
        path: 'verify-students',
        component: StudentVerificationComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['placement-officer', 'admin'] }
    },
    {
        path: 'verify-companies',
        component: CompanyVerificationComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['placement-officer', 'admin'] }
    },
    {
        path: 'monitor-placements',
        component: PlacementMonitorComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['placement-officer', 'admin'] }
    }
];
