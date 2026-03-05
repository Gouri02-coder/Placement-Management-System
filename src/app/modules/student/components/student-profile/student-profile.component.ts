import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student, Education, Project } from '../../models/student.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  student: Student | null = null;
  profileForm: FormGroup;
  educationForm: FormGroup;
  projectForm: FormGroup;
  activeTab = 'personal';
  isEditing = false;

  // Temporary properties for chip inputs
  newTechnology = '';
  newSkill = '';

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.createProfileForm();
    this.educationForm = this.createEducationForm();
    this.projectForm = this.createProjectForm();
  }

  ngOnInit(): void {
    this.loadStudentProfile();
  }

  loadStudentProfile(): void {
    // For demo purposes, create a mock student
    this.student = {
      id: '123',
      userId: 'user123',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, State',
        dateOfBirth: new Date('2000-01-01')
      },
      academicInfo: {
        college: 'ABC University',
        degree: 'B.Tech',
        branch: 'Computer Science',
        semester: 6,
        cgpa: 8.5,
        graduationYear: 2024
      },
      skills: ['JavaScript', 'Angular', 'TypeScript'],
      education: [
        {
          institution: 'ABC University',
          degree: 'B.Tech',
          field: 'Computer Science',
          startDate: new Date('2020-08-01'),
          endDate: new Date('2024-05-01'),
          percentage: 85
        }
      ],
      projects: [
        {
          title: 'Student Management System',
          description: 'A comprehensive system for managing student data',
          technologies: ['Angular', 'Node.js', 'MongoDB'],
          duration: '3 months',
          githubLink: 'https://github.com/johndoe/student-management'
        }
      ],
      resumeUrl: '',
      profilePhoto: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.populateProfileForm();
    
    // Uncomment for real API call:
    /*
    const studentId = '123';
    this.studentService.getStudentProfile(studentId).subscribe({
      next: (student) => {
        this.student = student;
        this.populateProfileForm();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
    */
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        dateOfBirth: ['', Validators.required]
      }),
      academicInfo: this.fb.group({
        college: ['', Validators.required],
        degree: ['', Validators.required],
        branch: ['', Validators.required],
        semester: ['', Validators.required],
        cgpa: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
        graduationYear: ['', Validators.required]
      }),
      skills: [[]]
    });
  }

  createEducationForm(): FormGroup {
    return this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      fieldOfStudy: ['', Validators.required], // Fixed: fieldOfStudy instead of field
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  createProjectForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      technologies: [[]],
      duration: [''],
      githubLink: ['']
    });
  }

  populateProfileForm(): void {
    if (!this.student) return;
    
    this.profileForm.patchValue({
      personalInfo: this.student.personalInfo,
      academicInfo: this.student.academicInfo,
      skills: this.student.skills || []
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.valid && this.student) {
      // For demo purposes, update local student object
      const formValue = this.profileForm.value;
      if (this.student.personalInfo) {
        Object.assign(this.student.personalInfo, formValue.personalInfo);
      }
      if (this.student.academicInfo) {
        Object.assign(this.student.academicInfo, formValue.academicInfo);
      }
      this.student.skills = formValue.skills;
      
      this.isEditing = false;
      
      // Uncomment for real API call:
      /*
      this.studentService.updateStudentProfile(this.student.id, this.profileForm.value)
        .subscribe({
          next: (updatedStudent) => {
            this.student = updatedStudent;
            this.isEditing = false;
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          }
        });
      */
    }
  }

  onAddEducation(): void {
    if (this.educationForm.valid && this.student) {
      const educationData = {
        ...this.educationForm.value,
        field: this.educationForm.value.fieldOfStudy // Map fieldOfStudy to field
      };
      
      // For demo purposes, add to local student object
      if (!this.student.education) {
        this.student.education = [];
      }
      this.student.education.push(educationData);
      this.educationForm.reset();
      
      // Uncomment for real API call:
      /*
      this.studentService.addEducation(this.student.id, this.educationForm.value)
        .subscribe({
          next: (updatedStudent) => {
            this.student = updatedStudent;
            this.educationForm.reset();
          }
        });
      */
    }
  }

  onAddProject(): void {
    if (this.projectForm.valid && this.student) {
      // For demo purposes, add to local student object
      if (!this.student.projects) {
        this.student.projects = [];
      }
      this.student.projects.push(this.projectForm.value);
      this.projectForm.reset();
      
      // Uncomment for real API call:
      /*
      this.studentService.addProject(this.student.id, this.projectForm.value)
        .subscribe({
          next: (updatedStudent) => {
            this.student = updatedStudent;
            this.projectForm.reset();
          }
        });
      */
    }
  }

  // Fixed: Added missing methods that are referenced in the template
  addTechnology(event: any): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    
    if (value) {
      const technologies = this.projectForm.get('technologies')?.value || [];
      if (!technologies.includes(value)) {
        technologies.push(value);
        this.projectForm.get('technologies')?.setValue(technologies);
      }
      input.value = '';
    }
  }

  addSkillInput(event: any): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    
    if (value) {
      const skills = this.profileForm.get('skills')?.value || [];
      if (!skills.includes(value)) {
        skills.push(value);
        this.profileForm.get('skills')?.setValue(skills);
      }
      input.value = '';
    }
  }

  onTechnologyRemove(tech: string): void {
    const technologies = this.projectForm.get('technologies')?.value || [];
    const index = technologies.indexOf(tech);
    if (index >= 0) {
      technologies.splice(index, 1);
      this.projectForm.get('technologies')?.setValue(technologies);
    }
  }

  onSkillRemove(skill: string): void {
    const skills = this.profileForm.get('skills')?.value || [];
    const index = skills.indexOf(skill);
    if (index >= 0) {
      skills.splice(index, 1);
      this.profileForm.get('skills')?.setValue(skills);
    }
  }

  addSuggestedSkill(skill: string): void {
    const skills = this.profileForm.get('skills')?.value || [];
    if (!skills.includes(skill)) {
      skills.push(skill);
      this.profileForm.get('skills')?.setValue(skills);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}