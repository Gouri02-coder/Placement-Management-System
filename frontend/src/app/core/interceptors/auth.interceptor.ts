import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  // Log all requests
  console.log('=== INTERCEPTOR ===');
  console.log('Request URL:', req.url);
  
  // Add auth token to requests except for auth endpoints
  if (shouldAddToken(req)) {
    const token = tokenService.getToken();
    console.log('Token from service:', token);
    console.log('Token exists:', !!token);
    if (token) {
      console.log('Token parts:', token.split('.').length);
      console.log('Token valid JWT:', tokenService.isValidJwtToken(token));
    }
    req = addToken(req, tokenService);
  } else {
    console.log('Skipping token for auth endpoint');
  }

  return next(req).pipe(
    catchError((error) => {
      console.log('Request error:', error.status, error.message);
      if (error.status === 401 && shouldHandleRefresh(req)) {
        return handle401Error(req, next, authService, tokenService);
      }
      return throwError(() => error) as Observable<HttpEvent<any>>;
    })
  );
};

function shouldAddToken(req: HttpRequest<any>): boolean {
  const excludeUrls = ['/auth/login', '/auth/register', '/auth/refresh'];
  const shouldAdd = !excludeUrls.some(url => req.url.includes(url));
  console.log('shouldAddToken for', req.url, ':', shouldAdd);
  return shouldAdd;
}

function shouldHandleRefresh(req: HttpRequest<any>): boolean {
  return !req.url.includes('/auth/') && !req.url.includes('/refresh');
}

function addToken(req: HttpRequest<any>, tokenService: TokenService): HttpRequest<any> {
  const token = tokenService.getToken();
  if (token && tokenService.isValidJwtToken(token)) {
    console.log('Adding Authorization header with token');
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('No valid token to add to request');
    if (token) {
      console.warn('Token exists but invalid format. Parts:', token.split('.').length);
    }
  }
  return req;
}

function handle401Error(req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService, tokenService: TokenService): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        isRefreshing = false;
        if (response?.token) {
          tokenService.setToken(response.token);
          refreshTokenSubject.next(response.token);
        }
        return next(addToken(req, tokenService));
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error) as Observable<HttpEvent<any>>;
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token): token is string => token != null),
      take(1),
      switchMap(() => {
        return next(addToken(req, tokenService));
      })
    );
  }
}