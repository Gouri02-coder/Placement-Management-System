import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlacementDrive, DriveRound } from '../models/drive.model';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  private apiUrl = 'http://localhost:3000/api/drives';

  constructor(private http: HttpClient) {}

  getDrivesByCompany(companyId: string): Observable<PlacementDrive[]> {
    return this.http.get<PlacementDrive[]>(`${this.apiUrl}/company/${companyId}`);
  }

  getDriveById(driveId: string): Observable<PlacementDrive> {
    return this.http.get<PlacementDrive>(`${this.apiUrl}/${driveId}`);
  }

  createDrive(driveData: Partial<PlacementDrive>): Observable<PlacementDrive> {
    return this.http.post<PlacementDrive>(this.apiUrl, driveData);
  }

  updateDrive(driveId: string, driveData: Partial<PlacementDrive>): Observable<PlacementDrive> {
    return this.http.put<PlacementDrive>(`${this.apiUrl}/${driveId}`, driveData);
  }

  addDriveRound(driveId: string, round: Partial<DriveRound>): Observable<PlacementDrive> {
    return this.http.post<PlacementDrive>(`${this.apiUrl}/${driveId}/rounds`, round);
  }

  updateDriveRound(driveId: string, roundId: string, roundData: Partial<DriveRound>): Observable<PlacementDrive> {
    return this.http.put<PlacementDrive>(`${this.apiUrl}/${driveId}/rounds/${roundId}`, roundData);
  }

  publishRoundResults(driveId: string, roundId: string, results: any[]): Observable<PlacementDrive> {
    return this.http.post<PlacementDrive>(`${this.apiUrl}/${driveId}/rounds/${roundId}/results`, { results });
  }

  uploadDriveDocument(driveId: string, documentFile: File): Observable<{ documentUrl: string }> {
    const formData = new FormData();
    formData.append('document', documentFile);
    return this.http.post<{ documentUrl: string }>(`${this.apiUrl}/${driveId}/documents`, formData);
  }
}