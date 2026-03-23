import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { Company, CompanyProfile } from '../models';

interface CompanyApiItem {
  id: number;
  name: string;
  industry: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  verificationStatus?: string;
  verificationRemarks?: string;
  verifiedByPto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyMonitorService {
  private readonly apiService = inject(ApiService);

  getCompanies(): Observable<Company[]> {
    return this.apiService.get<CompanyApiItem[]>('api/companies').pipe(
      map((companies) => companies.map((company) => this.mapCompany(company)))
    );
  }

  getCompanyProfile(companyId: string): Observable<CompanyProfile> {
    return this.apiService.get<CompanyApiItem>(`api/companies/${companyId}`).pipe(
      map((company) => this.mapCompanyProfile(company))
    );
  }

  updateCompanyVerification(
    companyId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
    remarks: string,
    verifiedBy = 'PTO'
  ): Observable<CompanyProfile> {
    return this.apiService
      .patch<CompanyApiItem>(
        `api/companies/${companyId}/verification?verifiedBy=${encodeURIComponent(verifiedBy)}`,
        {
          status,
          remarks
        }
      )
      .pipe(map((company) => this.mapCompanyProfile(company)));
  }

  private mapCompany(company: CompanyApiItem): Company {
    return {
      id: String(company.id),
      name: company.name,
      industry: company.industry,
      location: company.address,
      roleCount: 0,
      activeDriveCount: 0,
      status: this.normalizeCompanyStatus(company.verificationStatus)
    };
  }

  private mapCompanyProfile(company: CompanyApiItem): CompanyProfile {
    return {
      ...this.mapCompany(company),
      contactName: company.name,
      contactRole: 'Recruiter',
      contactEmail: company.email,
      campusCoordinator: company.verifiedByPto || 'PTO',
      description: company.description
    };
  }

  private normalizeCompanyStatus(
    status?: string
  ): 'Approved' | 'Pending' | 'Under Review' | 'Needs Clarification' {
    if (status === 'APPROVED') {
      return 'Approved';
    }

    if (status === 'REJECTED') {
      return 'Needs Clarification';
    }

    return 'Pending';
  }
}

