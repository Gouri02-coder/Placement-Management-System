import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface StudentRecord {
  id: string;
  name: string;
  department: string;
  cgpa: number;
  status: 'Placed' | 'In Process' | 'Not Started';
  company: string;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList {
  query = '';
  statusFilter: 'All' | StudentRecord['status'] = 'All';

  students: StudentRecord[] = [
    { id: 'ST-101', name: 'Arjun Mehta', department: 'CSE', cgpa: 8.9, status: 'Placed', company: 'Nexora Labs' },
    { id: 'ST-102', name: 'Isha Verma', department: 'IT', cgpa: 8.2, status: 'In Process', company: 'ByteWorks' },
    { id: 'ST-103', name: 'Rohan Singh', department: 'ECE', cgpa: 7.7, status: 'Not Started', company: '-' },
    { id: 'ST-104', name: 'Ananya Das', department: 'CSE', cgpa: 9.1, status: 'Placed', company: 'CloudArc' },
    { id: 'ST-105', name: 'Karan Patel', department: 'ME', cgpa: 7.9, status: 'In Process', company: 'FleetEdge' }
  ];

  get filteredStudents(): StudentRecord[] {
    return this.students.filter((student) => {
      const matchesQuery =
        !this.query ||
        student.name.toLowerCase().includes(this.query.toLowerCase()) ||
        student.id.toLowerCase().includes(this.query.toLowerCase()) ||
        student.department.toLowerCase().includes(this.query.toLowerCase());

      const matchesStatus = this.statusFilter === 'All' || student.status === this.statusFilter;
      return matchesQuery && matchesStatus;
    });
  }

  markReviewed(student: StudentRecord): void {
    student.status = student.status === 'Not Started' ? 'In Process' : student.status;
  }
}
