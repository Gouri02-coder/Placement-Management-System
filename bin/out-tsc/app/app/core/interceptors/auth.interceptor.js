import { inject } from '@angular/core';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject(null);
export const authInterceptor = (req, next) => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);
    // Add auth token to requests except for auth endpoints
    if (shouldAddToken(req)) {
        req = addToken(req, tokenService);
    }
    return next(req).pipe(catchError((error) => {
        if (error.status === 401 && shouldHandleRefresh(req)) {
            return handle401Error(req, next, authService, tokenService);
        }
        return throwError(() => error);
    }));
};
function shouldAddToken(req) {
    return !req.url.includes('/auth/');
}
function shouldHandleRefresh(req) {
    return !req.url.includes('/auth/');
}
function addToken(req, tokenService) {
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
function handle401Error(req, next, authService, tokenService) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);
        return authService.refreshToken().pipe(switchMap((response) => {
            isRefreshing = false;
            tokenService.setToken(response.token);
            refreshTokenSubject.next(response.token);
            return next(addToken(req, tokenService));
        }), catchError((error) => {
            isRefreshing = false;
            authService.logout();
            return throwError(() => error);
        }));
    }
    else {
        return refreshTokenSubject.pipe(filter((token) => token != null), take(1), switchMap(() => {
            return next(addToken(req, tokenService));
        }));
    }
}
