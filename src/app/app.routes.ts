import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing page route
  {
    path: '',
    loadComponent: () => import('./layouts/landing-page/landing-page').then(m => m.LandingPageComponent)
  },
  
  // Auth routes
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.route').then(m => m.AUTH_ROUTES)
  },
  
  // Admin routes
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.route').then(m => m.ADMIN_ROUTES)
  },
  
  // Student routes
  {
    path: 'student',
    loadChildren: () => import('./modules/student/student.routes').then(m => m.STUDENT_ROUTES)
  },
  
  // Company routes
  {
    path: 'company', 
    loadChildren: () => import('./modules/company/company.route').then(m => m.COMPANY_ROUTES)
  },
  
  // Wildcard route
  { path: '**', redirectTo: '' }
];