import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface StudentDetail {
  id: string;
  name: string;
  department: string;
  cgpa: number;
  email: string;
  phone: string;
  status: 'Placed' | 'In Process' | 'Not Started';
  currentCompany: string;
  skills: string[];
  applications: Array<{ role: string; company: string; status: string }>;
}

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css'
})
export class StudentDetails {
  studentId = '';
  adminNote = '';

  students: StudentDetail[] = [
    {
      id: 'ST-101',
      name: 'Arjun Mehta',
      department: 'CSE',
      cgpa: 8.9,
      email: 'arjun.m@college.edu.in',
      phone: '9876543210',
      status: 'Placed',
      currentCompany: 'Nexora Labs',
      skills: ['Angular', 'TypeScript', 'Node.js'],
      applications: [
        { role: 'Frontend Engineer', company: 'Nexora Labs', status: 'Selected' },
        { role: 'SDE I', company: 'ByteWorks', status: 'Shortlisted' }
      ]
    },
    {
      id: 'ST-102',
      name: 'Isha Verma',
      department: 'IT',
      cgpa: 8.2,
      email: 'isha.v@college.edu.in',
      phone: '9812345678',
      status: 'In Process',
      currentCompany: '-',
      skills: ['SQL', 'Python', 'Power BI'],
      applications: [{ role: 'Data Analyst', company: 'CoreMatrix', status: 'Interview' }]
    }
  ];

  currentStudent: StudentDetail = this.students[0];

  constructor(private route: ActivatedRoute) {
    this.studentId = this.route.snapshot.paramMap.get('id') || this.students[0].id;
    this.currentStudent = this.students.find((student) => student.id === this.studentId) || this.students[0];
  }

  updateStatus(status: StudentDetail['status']): void {
    this.currentStudent.status = status;
  }

  saveNote(): void {
    this.adminNote = this.adminNote.trim();
  }
}
