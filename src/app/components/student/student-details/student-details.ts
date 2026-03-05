import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StudentDetail {
  id: number;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
  };
  academicInfo: {
    department: string;
    cgpa: number;
    currentSemester: string;
    expectedGraduation: string;
    major: string;
  };
  placementInfo: {
    status: 'Placed' | 'Not Placed' | 'Internship';
    company?: string;
    position?: string;
    package?: string;
    placementDate?: string;
  };
  skills: string[];
  experience: WorkExperience[];
  projects: Project[];
}

interface WorkExperience {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Project {
  id: number;
  name: string;
  type: string;
  duration: string;
  description: string;
  technologies: string[];
}

@Component({
  selector: 'app-student-details',
  imports: [CommonModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css'
})
export class StudentDetails implements OnInit {
  student: StudentDetail = {
    id: 0,
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
    placementInfo: {
      status: 'Not Placed'
    },
    skills: [],
    experience: [],
    projects: []
  };

  ngOnInit(): void {
    this.loadStudentData();
  }

  private loadStudentData(): void {
    this.student = {
      id: 1,
      personalInfo: {
        fullName: "John Smith",
        email: "john.smith@university.edu",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "2000-01-15",
        address: "123 University Avenue, San Francisco, CA 94102"
      },
      academicInfo: {
        department: "Computer Science",
        cgpa: 3.8,
        currentSemester: "8th",
        expectedGraduation: "May 2024",
        major: "Software Engineering"
      },
      placementInfo: {
        status: "Placed",
        company: "Google Inc.",
        position: "Software Engineer",
        package: "$120,000",
        placementDate: "2024-01-15"
      },
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
      experience: [
        {
          id: 1,
          company: "Tech Startup Inc.",
          position: "Software Development Intern",
          duration: "May 2023 - August 2023",
          description: "Developed and maintained web applications using React and Node.js."
        }
      ],
      projects: [
        {
          id: 1,
          name: "E-commerce Platform",
          type: "Full-stack Web Application",
          duration: "January 2023 - April 2023",
          description: "Developed a complete e-commerce platform with user authentication.",
          technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
        }
      ]
    };
  }

  getAvatarInitials(): string {
    return this.student.personalInfo.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }

  // Safe method that handles optional dates
  formatDate(dateString: string | undefined): string {
    if (!dateString) {
      return 'Not specified';
    }
    try {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  }

  // Helper method to safely get placement date
  getPlacementDate(): string {
    return this.formatDate(this.student.placementInfo.placementDate);
  }

  handleBack(): void {
    alert('Navigating back to student list...');
  }

  handleEdit(): void {
    alert('Opening student edit form...');
  }

  handlePrint(): void {
    window.print();
  }
}