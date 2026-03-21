import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'An unexpected error occurred';
      
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = getServerErrorMessage(error);
      }

      handleErrorResponse(error, notificationService);

      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};

function getServerErrorMessage(error: any): string {
  switch (error.status) {
    case 400:
      return getValidationErrorMessage(error) || 'Bad Request';
    case 401:
      return 'Unauthorized access';
    case 403:
      return 'Access forbidden';
    case 404:
      return 'Resource not found';
    case 409:
      return 'Conflict occurred';
    case 422:
      return getValidationErrorMessage(error) || 'Validation failed';
    case 500:
      return 'Internal server error';
    case 503:
      return 'Service unavailable';
    default:
      return error.error?.message || error.message || 'Unknown server error';
  }
}

function getValidationErrorMessage(error: any): string | null {
  if (error.error?.errors) {
    const errors = error.error.errors;
    if (typeof errors === 'string') return errors;
    if (Array.isArray(errors)) return errors.join(', ');
    if (typeof errors === 'object') return Object.values(errors).join(', ');
  }
  return error.error?.message || null;
}

function handleErrorResponse(error: any, notificationService: NotificationService): void {
  const userFriendlyMessage = getUserFriendlyMessage(error);

  switch (error.status) {
    case 0:
      notificationService.error('Network Error', 'Unable to connect to the server.');
      break;
    case 401:
      if (!error.url?.includes('/auth/')) {
        notificationService.warning('Session Expired', 'Please log in again.');
      }
      break;
    case 403:
      notificationService.error('Access Denied', 'No permission for this action.');
      break;
    case 404:
      notificationService.warning('Not Found', 'Resource not found.');
      break;
    case 409:
      notificationService.warning('Conflict', userFriendlyMessage);
      break;
    case 422:
      notificationService.warning('Validation Error', userFriendlyMessage);
      break;
    case 500:
      notificationService.error('Server Error', 'Please try again later.');
      break;
    case 503:
      notificationService.error('Service Unavailable', 'Please try again later.');
      break;
    default:
      if (error.status >= 400 && error.status < 500) {
        notificationService.warning('Request Error', userFriendlyMessage);
      } else if (error.status >= 500) {
        notificationService.error('Server Error', userFriendlyMessage);
      }
      break;
  }
}

function getUserFriendlyMessage(error: any): string {
  if (error.error?.message) return error.error.message;

  switch (error.status) {
    case 400: return 'The request was invalid. Please check your input.';
    case 401: return 'Please log in to continue.';
    case 403: return 'No permission to access this resource.';
    case 404: return 'Resource not found.';
    case 409: return 'Action conflicts with existing data.';
    case 422: return 'Please check your input and try again.';
    case 500: return 'Internal server error occurred.';
    default: return 'An unexpected error occurred. Please try again.';
  }
}