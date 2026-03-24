import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let ResumeBuilderComponent = class ResumeBuilderComponent {
    student = {
        id: '',
        userId: '',
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            dateOfBirth: new Date()
        },
        academicInfo: {
            college: '',
            degree: '',
            branch: '',
            semester: 1,
            cgpa: 0,
            graduationYear: new Date().getFullYear()
        },
        education: [], // Add this
        projects: [], // Add this
        skills: [],
        resumeUrl: '',
        profilePhoto: '',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    educations = [this.createEmptyEducation()];
    projects = [this.createEmptyProject()];
    newSkill = '';
    ngOnInit() {
        this.loadStudentData();
    }
    createEmptyEducation() {
        return {
            institution: '',
            degree: '',
            field: '', // Add this property
            startDate: new Date(),
            endDate: new Date(),
            percentage: 0
        };
    }
    createEmptyProject() {
        return {
            title: '',
            description: '',
            technologies: [], // Change from string to array
            duration: '',
            githubLink: ''
        };
    }
    addEducation() {
        this.educations.push(this.createEmptyEducation());
    }
    removeEducation(index) {
        if (this.educations.length > 1) {
            this.educations.splice(index, 1);
        }
    }
    addProject() {
        this.projects.push(this.createEmptyProject());
    }
    removeProject(index) {
        if (this.projects.length > 1) {
            this.projects.splice(index, 1);
        }
    }
    addSkill() {
        if (this.newSkill.trim() && !this.student.skills.includes(this.newSkill.trim())) {
            this.student.skills.push(this.newSkill.trim());
            this.newSkill = '';
        }
    }
    removeSkill(skill) {
        this.student.skills = this.student.skills.filter(s => s !== skill);
    }
    loadStudentData() {
        const savedData = localStorage.getItem('studentResume');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.student = { ...this.student, ...data.student };
            this.educations = data.educations || this.educations;
            this.projects = data.projects || this.projects;
            // Parse date strings back to Date objects
            this.educations.forEach(edu => {
                edu.startDate = new Date(edu.startDate);
                edu.endDate = new Date(edu.endDate);
            });
        }
    }
    saveResume() {
        // Update student object with current educations and projects
        this.student.education = this.educations;
        this.student.projects = this.projects;
        const resumeData = {
            student: this.student,
            educations: this.educations,
            projects: this.projects
        };
        localStorage.setItem('studentResume', JSON.stringify(resumeData));
        alert('Resume saved successfully!');
    }
    previewResume() {
        this.saveResume();
        console.log('Opening resume preview...');
    }
    downloadResume() {
        this.saveResume();
        alert('Resume download functionality would be implemented here!');
    }
    // Helper method to handle technologies input
    onTechnologiesChange(technologiesString, index) {
        this.projects[index].technologies = technologiesString
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech.length > 0);
    }
};
ResumeBuilderComponent = __decorate([
    Component({
        selector: 'app-resume-builder',
        standalone: true,
        imports: [CommonModule, FormsModule],
        templateUrl: './resume-builder.component.html',
        styleUrls: ['./resume-builder.component.css']
    })
], ResumeBuilderComponent);
export { ResumeBuilderComponent };
