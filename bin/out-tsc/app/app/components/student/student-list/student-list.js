import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let StudentList = class StudentList {
    students = [];
    filteredStudents = [];
    currentPage = 1;
    itemsPerPage = 10;
    searchTerm = '';
    selectedDepartment = '';
    selectedStatus = '';
    departments = [
        'Computer Science',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering'
    ];
    statuses = ['Placed', 'Not Placed', 'Internship'];
    ngOnInit() {
        this.initializeStudents();
    }
    initializeStudents() {
        this.students = [
            {
                id: 1,
                name: "John Smith",
                email: "john.smith@university.edu",
                phone: "+1 (555) 123-4567",
                department: "Computer Science",
                cgpa: 3.8,
                status: "Placed",
                placedCompany: "Google",
                placementDate: "2024-01-15"
            },
            {
                id: 2,
                name: "Sarah Johnson",
                email: "sarah.johnson@university.edu",
                phone: "+1 (555) 987-6543",
                department: "Electrical Engineering",
                cgpa: 3.6,
                status: "Internship",
                placedCompany: "Tesla",
                placementDate: "2024-02-01"
            },
            {
                id: 3,
                name: "Michael Chen",
                email: "michael.chen@university.edu",
                phone: "+1 (555) 456-7890",
                department: "Computer Science",
                cgpa: 3.9,
                status: "Placed",
                placedCompany: "Microsoft",
                placementDate: "2024-01-20"
            },
            {
                id: 4,
                name: "Emily Davis",
                email: "emily.davis@university.edu",
                phone: "+1 (555) 234-5678",
                department: "Mechanical Engineering",
                cgpa: 3.4,
                status: "Not Placed"
            }
        ];
        this.filteredStudents = [...this.students];
    }
    onSearch() {
        this.applyFilters();
    }
    onFilterChange() {
        this.applyFilters();
    }
    applyFilters() {
        this.filteredStudents = this.students.filter(student => {
            const matchesSearch = this.searchTerm === '' ||
                student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                student.department.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesDepartment = this.selectedDepartment === '' ||
                student.department === this.selectedDepartment;
            const matchesStatus = this.selectedStatus === '' ||
                student.status === this.selectedStatus;
            return matchesSearch && matchesDepartment && matchesStatus;
        });
        this.currentPage = 1;
    }
    viewStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            alert(`Student Details:\n\nName: ${student.name}\nEmail: ${student.email}\nDepartment: ${student.department}\nStatus: ${student.status}`);
        }
    }
    editStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            alert(`Editing student: ${student.name}`);
        }
    }
    deleteStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            if (confirm(`Are you sure you want to delete ${student.name}?`)) {
                this.students = this.students.filter(s => s.id !== studentId);
                this.applyFilters();
                alert('Student deleted successfully');
            }
        }
    }
    addStudent() {
        alert('Opening student form to add new student...');
    }
    exportData() {
        // Simple CSV export
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'CGPA', 'Status', 'Company'];
        const csvData = this.filteredStudents.map(student => [
            student.id,
            student.name,
            student.email,
            student.phone,
            student.department,
            student.cgpa,
            student.status,
            student.placedCompany || ''
        ]);
        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Data exported successfully!');
    }
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }
    nextPage() {
        const totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
        }
    }
    get paginatedStudents() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredStudents.slice(startIndex, endIndex);
    }
    get totalPages() {
        return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    }
    // Navigation methods for the template
    goBack() {
        alert('Going back...');
    }
    printList() {
        window.print();
    }
};
StudentList = __decorate([
    Component({
        selector: 'app-student-list',
        imports: [CommonModule, FormsModule],
        templateUrl: './student-list.html',
        styleUrl: './student-list.css'
    })
], StudentList);
export { StudentList };
