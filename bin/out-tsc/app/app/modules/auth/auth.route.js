import { LoginComponent } from './components/login/login.components';
import { RegisterComponent } from './components/register/register.component';
export const AUTH_ROUTES = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login - Placement System'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register - Placement System'
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
