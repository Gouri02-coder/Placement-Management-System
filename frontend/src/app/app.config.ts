import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';

export function tokenGetter() {
  return localStorage.getItem('authToken');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter,
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
