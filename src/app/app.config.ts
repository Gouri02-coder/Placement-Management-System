import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { routes } from './app.routes';

import { JwtModule } from '@auth0/angular-jwt';

// Token getter function - UPDATE THIS
export function tokenGetter() {
  return localStorage.getItem('authToken'); // CHANGED: 'access_token' → 'authToken'
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), 
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080'],
          disallowedRoutes: [
            'http://localhost:8080/api/auth/login',
            'http://localhost:8080/api/auth/register'
          ]
        }
      })
    )
  ]
};