import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student, Education, Project } from '../../models/student.model';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css']
})
export class ResumeBuilderComponent implements OnInit {
  student: Student = {
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
    education: [],  // Add this
    projects: [],   // Add this
    skills: [],
    resumeUrl: '',
    profilePhoto: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  educations: Education[] = [this.createEmptyEducation()];
  projects: Project[] = [this.createEmptyProject()];
  newSkill: string = '';

  ngOnInit(): void {
    this.loadStudentData();
  }

  createEmptyEducation(): Education {
    return {
      institution: '',
      degree: '',
      field: '',  // Add this property
      startDate: new Date(),
      endDate: new Date(),
      percentage: 0
    };
  }

  createEmptyProject(): Project {
    return {
      title: '',
      description: '',
      technologies: [],  // Change from string to array
      duration: '',
      githubLink: ''
    };
  }

  addEducation(): void {
    this.educations.push(this.createEmptyEducation());
  }

  removeEducation(index: number): void {
    if (this.educations.length > 1) {
      this.educations.splice(index, 1);
    }
  }

  addProject(): void {
    this.projects.push(this.createEmptyProject());
  }

  removeProject(index: number): void {
    if (this.projects.length > 1) {
      this.projects.splice(index, 1);
    }
  }

  addSkill(): void {
    if (this.newSkill.trim() && !this.student.skills.includes(this.newSkill.trim())) {
      this.student.skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(skill: string): void {
    this.student.skills = this.student.skills.filter(s => s !== skill);
  }

  loadStudentData(): void {
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

  saveResume(): void {
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

  previewResume(): void {
    this.saveResume();
    console.log('Opening resume preview...');
  }

  downloadResume(): void {
    this.saveResume();
    alert('Resume download functionality would be implemented here!');
  }

  // Helper method to handle technologies input
  onTechnologiesChange(technologiesString: string, index: number): void {
    this.projects[index].technologies = technologiesString
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);
  }
}