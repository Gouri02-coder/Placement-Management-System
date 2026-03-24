import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let StudentForm = class StudentForm {
    // SOLUTION 1: Initialize with default values (Recommended)
    student = {
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            address: ''
        },
        academicInfo: {
            department: '',
            cgpa: 0,
            currentSemester: '',
            expectedGraduation: '',
            major: ''
        },
        skills: [],
        newSkill: ''
    };
    // SOLUTION 2: Or use definite assignment assertion (Alternative)
    // student!: StudentFormData;
    isEditMode = false;
    departments = [
        'Computer Science',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering'
    ];
    semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    ngOnInit() {
        // If using definite assignment assertion, initialize here:
        // this.student = this.initializeForm();
    }
    addSkill() {
        if (this.student.newSkill.trim() && !this.student.skills.includes(this.student.newSkill.trim())) {
            this.student.skills.push(this.student.newSkill.trim());
            this.student.newSkill = '';
        }
    }
    removeSkill(skill) {
        this.student.skills = this.student.skills.filter(s => s !== skill);
    }
    onSubmit() {
        if (this.validateForm()) {
            if (this.isEditMode) {
                alert('Student updated successfully!');
            }
            else {
                alert('Student created successfully!');
            }
        }
        else {
            alert('Please fill all required fields correctly.');
        }
    }
    validateForm() {
        const personal = this.student.personalInfo;
        const academic = this.student.academicInfo;
        return !!(personal.fullName &&
            personal.email &&
            personal.phone &&
            personal.dateOfBirth &&
            academic.department &&
            academic.cgpa > 0 &&
            academic.currentSemester &&
            academic.expectedGraduation);
    }
    onCancel() {
        if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            this.initializeForm();
        }
    }
    initializeForm() {
        this.student = {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                address: ''
            },
            academicInfo: {
                department: '',
                cgpa: 0,
                currentSemester: '',
                expectedGraduation: '',
                major: ''
            },
            skills: [],
            newSkill: ''
        };
    }
    loadSampleData() {
        this.student = {
            personalInfo: {
                fullName: 'John Smith',
                email: 'john.smith@university.edu',
                phone: '+1 (555) 123-4567',
                dateOfBirth: '2000-01-15',
                address: '123 University Ave, City, State 12345'
            },
            academicInfo: {
                department: 'Computer Science',
                cgpa: 3.8,
                currentSemester: '8th',
                expectedGraduation: '2024-05-15',
                major: 'Software Engineering'
            },
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
            newSkill: ''
        };
    }
};
StudentForm = __decorate([
    Component({
        selector: 'app-student-form',
        imports: [CommonModule, FormsModule],
        templateUrl: './student-form.html',
        styleUrl: './student-form.css'
    })
], StudentForm);
export { StudentForm };
