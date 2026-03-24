export const routes = [
    {
        path: '',
        loadComponent: () => import('./layouts/landing-page/landing-page').then(m => m.LandingPageComponent)
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.route').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.route').then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'student',
        loadChildren: () => import('./modules/student/student.routes').then(m => m.STUDENT_ROUTES)
    },
    {
        path: 'company',
        loadChildren: () => import('./modules/company/company.route').then(m => m.COMPANY_ROUTES)
    },
    {
        path: 'placement',
        loadChildren: () => import('./modules/PTO/pto.route').then(m => m.PTO_ROUTES)
    },
    { path: '**', redirectTo: '' }
];
