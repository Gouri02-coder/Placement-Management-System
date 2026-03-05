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

  // Add auth token to requests except for auth endpoints
  if (shouldAddToken(req)) {
    req = addToken(req, tokenService);
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && shouldHandleRefresh(req)) {
        return handle401Error(req, next, authService, tokenService);
      }
      return throwError(() => error) as Observable<HttpEvent<any>>;
    })
  );
};

function shouldAddToken(req: HttpRequest<any>): boolean {
  return !req.url.includes('/auth/');
}

function shouldHandleRefresh(req: HttpRequest<any>): boolean {
  return !req.url.includes('/auth/');
}

function addToken(req: HttpRequest<any>, tokenService: TokenService): HttpRequest<any> {
  const token = tokenService.getToken();
  if (token) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
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
        tokenService.setToken(response.token);
        refreshTokenSubject.next(response.token);
        
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