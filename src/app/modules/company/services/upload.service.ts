import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Upload image file
   */
  uploadImage(file: File, folder: string = 'uploads'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('type', 'image');

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<UploadResponse>(
      `${this.apiUrl}/image`,
      formData,
      { 
        headers,
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(
      map(event => this.handleUploadEvent(event, file)),
      catchError(error => this.handleUploadError(error))
    );
  }

  /**
   * Upload document file
   */
  uploadDocument(file: File, folder: string = 'documents'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('type', 'document');

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<UploadResponse>(
      `${this.apiUrl}/document`,
      formData,
      { 
        headers,
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(
      map(event => this.handleUploadEvent(event, file)),
      catchError(error => this.handleUploadError(error))
    );
  }

  /**
   * Upload file with progress tracking
   */
  uploadWithProgress(file: File, type: 'image' | 'document', folder?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (folder) {
      formData.append('folder', folder);
    }
    
    formData.append('type', type);

    return this.http.post(
      `${this.apiUrl}/file`,
      formData,
      { 
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.loaded / (event.total || 1);
            return {
              type: 'progress',
              progress: Math.round(progress * 100)
            };
          case HttpEventType.Response:
            return {
              type: 'complete',
              data: event.body
            };
          default:
            return { type: 'other', event };
        }
      }),
      catchError(error => this.handleUploadError(error))
    );
  }

  /**
   * Delete uploaded file
   */
  deleteFile(url: string): Observable<void> {
    const params = new HttpParams().set('url', encodeURIComponent(url));
    
    return this.http.delete<void>(`${this.apiUrl}/file`, { params })
      .pipe(
        catchError(error => this.handleUploadError(error))
      );
  }

  /**
   * Get file information
   */
  getFileInfo(url: string): Observable<any> {
    const params = new HttpParams().set('url', encodeURIComponent(url));
    
    return this.http.get(`${this.apiUrl}/info`, { params })
      .pipe(
        catchError(error => this.handleUploadError(error))
      );
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { valid: boolean; error?: string } {
    const defaultOptions = {
      maxSize: 10 * 1024 * 1024, // 10MB default
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx']
    };

    const config = { ...defaultOptions, ...options };

    // Check file size
    if (file.size > config.maxSize) {
      return {
        valid: false,
        error: `File size exceeds limit. Maximum size is ${config.maxSize / (1024 * 1024)}MB`
      };
    }

    // Check MIME type
    if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`
      };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = config.allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (config.allowedExtensions.length > 0 && !hasValidExtension) {
      return {
        valid: false,
        error: `File extension not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Compress image before upload
   */
  compressImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Create thumbnail from image
   */
  createThumbnail(file: File, width: number = 200, height: number = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw image centered and cropped
          const scale = Math.max(width / img.width, height / img.height);
          const x = (width / 2) - (img.width / 2) * scale;
          const y = (height / 2) - (img.height / 2) * scale;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          resolve(canvas.toDataURL(file.type));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get file size in readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Extract file extension
   */
  getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  /**
   * Generate unique filename
   */
  generateUniqueFilename(originalName: string): string {
    const extension = this.getFileExtension(originalName);
    const nameWithoutExt = originalName.replace(`.${extension}`, '');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    
    return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
  }

  /**
   * Private helper methods
   */
  private handleUploadEvent(event: any, file: File): UploadResponse {
    if (event.type === HttpEventType.Response) {
      return {
        ...event.body,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      };
    }
    
    throw new Error('Upload not complete');
  }

  private handleUploadError(error: any): Observable<never> {
    let errorMessage = 'Upload failed';
    
    if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.status === 413) {
      errorMessage = 'File too large. Please choose a smaller file.';
    } else if (error.status === 415) {
      errorMessage = 'File type not supported.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Invalid file.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}