import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
let StudentVerificationComponent = class StudentVerificationComponent {
    students = [
        {
            id: 'STU-1023',
            name: 'Ananya Sharma',
            department: 'Computer Science',
            cgpa: 8.9,
            resumeStatus: 'verified',
            documentsPending: 1,
            status: 'pending'
        },
        {
            id: 'STU-1041',
            name: 'Rahul Verma',
            department: 'Information Technology',
            cgpa: 8.1,
            resumeStatus: 'needs-update',
            documentsPending: 2,
            status: 'pending'
        },
        {
            id: 'STU-1098',
            name: 'Priya Nair',
            department: 'Electronics',
            cgpa: 9.2,
            resumeStatus: 'verified',
            documentsPending: 0,
            status: 'approved'
        }
    ];
    approveStudent(studentId) {
        this.students = this.students.map(student => student.id === studentId ? { ...student, status: 'approved' } : student);
    }
    get pendingCount() {
        return this.students.filter(student => student.status === 'pending').length;
    }
};
StudentVerificationComponent = __decorate([
    Component({
        selector: 'app-student-verification',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './student-verification.html',
        styleUrls: ['./student-verification.css']
    })
], StudentVerificationComponent);
export { StudentVerificationComponent };
