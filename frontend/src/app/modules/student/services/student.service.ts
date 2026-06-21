import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Student, Education, Project, PersonalInfo, AcademicInfo } from '../models/student.model';

type StudentApiResponse = Partial<Student> & {
  id?: string | number;
  userId?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string | Date;
  department?: string;
  course?: string;
  year?: number;
  cgpa?: number;
  createdDate?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  personalInfo?: Partial<PersonalInfo>;
  academicInfo?: Partial<AcademicInfo>;
  education?: Education[];
  projects?: Project[];
  skills?: string[];
  resumeUrl?: string;
  profilePhoto?: string;
};

function toDate(value: unknown, fallback: Date = new Date()): Date {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value as string | number | Date);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function splitName(name: string): { firstName: string; lastName: string } {
  const normalized = name.trim().replace(/\s+/g, ' ');
  if (!normalized) {
    return { firstName: '', lastName: '' };
  }

  const [firstName, ...rest] = normalized.split(' ');
  return {
    firstName,
    lastName: rest.join(' ')
  };
}

function inferGraduationYear(currentStudyYear?: number, explicitGraduationYear?: number): number {
  if (explicitGraduationYear) {
    return explicitGraduationYear;
  }

  if (!currentStudyYear) {
    return new Date().getFullYear();
  }

  const remainingYears = Math.max(0, 4 - currentStudyYear);
  return new Date().getFullYear() + remainingYears;
}

function normalizeStudentPayload(student: StudentApiResponse, requestedId?: string): Student {
  const personalInfo: Partial<PersonalInfo> = student.personalInfo ?? {};
  const academicInfo: Partial<AcademicInfo> = student.academicInfo ?? {};
  const normalizedName = student.name?.trim() || `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim();
  const { firstName, lastName } = splitName(normalizedName || 'Student');
  const studyYear = typeof student.year === 'number' ? student.year : academicInfo.semester;

  return {
    id: String(student.id ?? requestedId ?? ''),
    userId: String(student.userId ?? student.id ?? requestedId ?? ''),
    personalInfo: {
      firstName: personalInfo.firstName || firstName,
      lastName: personalInfo.lastName || lastName,
      email: personalInfo.email || student.email || '',
      phone: personalInfo.phone || student.phone || '',
      address: personalInfo.address || student.address || '',
      dateOfBirth: toDate(personalInfo.dateOfBirth || student.dateOfBirth, new Date('2000-01-01'))
    },
    academicInfo: {
      college: academicInfo.college || '',
      degree: academicInfo.degree || student.course || '',
      branch: academicInfo.branch || student.department || '',
      semester: academicInfo.semester ?? studyYear ?? 1,
      cgpa: academicInfo.cgpa ?? student.cgpa ?? 0,
      graduationYear: inferGraduationYear(studyYear, academicInfo.graduationYear)
    },
    education: (student.education || []).map(item => ({
      ...item,
      startDate: toDate(item.startDate),
      endDate: toDate(item.endDate)
    })),
    projects: (student.projects || []).map(item => ({
      ...item,
      technologies: [...(item.technologies || [])]
    })),
    skills: [...(student.skills || [])],
    resumeUrl: student.resumeUrl || '',
    profilePhoto: student.profilePhoto || '',
    createdAt: toDate(student.createdAt || student.createdDate),
    updatedAt: toDate(student.updatedAt || student.createdAt || student.createdDate)
  };
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  getStudentProfile(studentId: string): Observable<Student> {
    return this.http.get<StudentApiResponse>(`${this.apiUrl}/${studentId}`).pipe(
      map((student) => normalizeStudentPayload(student, studentId))
    );
  }

  updateStudentProfile(studentId: string, profile: Partial<Student>): Observable<Student> {
    return this.http.put<StudentApiResponse>(`${this.apiUrl}/${studentId}`, profile).pipe(
      map((student) => normalizeStudentPayload(student, studentId))
    );
  }

  addEducation(studentId: string, education: Education): Observable<Student> {
    return this.http.post<StudentApiResponse>(`${this.apiUrl}/${studentId}/education`, education).pipe(
      map((student) => normalizeStudentPayload(student, studentId))
    );
  }

  addProject(studentId: string, project: Project): Observable<Student> {
    return this.http.post<StudentApiResponse>(`${this.apiUrl}/${studentId}/projects`, project).pipe(
      map((student) => normalizeStudentPayload(student, studentId))
    );
  }

  uploadResume(studentId: string, resumeFile: File): Observable<{ resumeUrl: string }> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    return this.http.post<{ resumeUrl: string }>(`${this.apiUrl}/${studentId}/resume`, formData);
  }
}

