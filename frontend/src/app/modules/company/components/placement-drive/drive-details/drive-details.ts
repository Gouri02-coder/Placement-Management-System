import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-drive-details',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './drive-details.html',
  styleUrl: './drive-details.css',
})
export class DriveDetails implements OnInit {
  driveId: string | null = null;
  drive: any = null;
  isLoading = true;
  error: string | null = null;
  
  // Application form
  showApplicationForm = false;
  applicationForm: any = {
    fullName: '',
    email: '',
    phone: '',
    rollNumber: '',
    branch: '',
    passingYear: '',
    cgpa: null,
    resumeLink: '',
    coverLetter: '',
    additionalInfo: ''
  };
  
  isSubmitting = false;
  
  // Registration stats
  registrationStats = {
    totalRegistered: 0,
    totalVacancies: 0,
    applicationRate: 0
  };
  
  // Timeline events
  timelineEvents = [
    { date: '2024-04-01', title: 'Registration Opens', description: 'Online registration begins', completed: true },
    { date: '2024-04-10', title: 'Registration Closes', description: 'Last date to register', completed: false },
    { date: '2024-04-15', title: 'Drive Date', description: 'Placement drive event', completed: false },
    { date: '2024-04-20', title: 'Result Declaration', description: 'Final results announced', completed: false }
  ];
  
  // Company social links
  socialLinks = [
    { icon: 'language', url: '#', label: 'Website' },
    { icon: 'linkedin', url: '#', label: 'LinkedIn' },
    { icon: 'twitter', url: '#', label: 'Twitter' },
    { icon: 'facebook', url: '#', label: 'Facebook' }
  ];
  
  // FAQ items
  faqs = [
    { question: 'What is the selection process?', answer: 'The selection process typically includes an online test, technical interview, and HR interview.', open: false },
    { question: 'Is there any registration fee?', answer: 'No, registration is completely free for all eligible students.', open: false },
    { question: 'What documents are required?', answer: 'You will need your resume, academic transcripts, ID proof, and any relevant certifications.', open: false },
    { question: 'Can I apply for multiple positions?', answer: 'Yes, you can apply for multiple positions if you meet the eligibility criteria for each.', open: false },
    { question: 'When will the results be announced?', answer: 'Results will be announced within 1 week after the completion of the drive.', open: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.driveId = params.get('id');
      if (this.driveId) {
        this.loadDriveDetails();
      } else {
        this.error = 'Drive ID not found';
        this.isLoading = false;
      }
    });
  }

  private loadDriveDetails(): void {
    // Simulate API call - replace with actual service
    setTimeout(() => {
      // Mock data based on drive ID
      const mockDrives: { [key: string]: any } = {
        '1': {
          id: 1,
          driveName: 'Tech Mahindra Campus Drive',
          driveType: 'onCampus',
          companyName: 'Tech Mahindra',
          companyLogo: 'https://via.placeholder.com/100x100?text=TM',
          companyDescription: 'Tech Mahindra is a leading provider of digital transformation, consulting, and business re-engineering services. With a strong focus on innovation and technology, we help businesses navigate the digital landscape.',
          industry: 'IT Services & Consulting',
          companySize: '100,000+ employees',
          headquarters: 'Pune, India',
          founded: '1986',
          website: 'https://www.techmahindra.com',
          driveDate: '2024-04-15',
          driveTime: '10:00 AM',
          venue: 'Main Auditorium, Academic Block',
          eligibleBranches: ['Computer Science', 'Information Technology'],
          minCGPA: 7.0,
          passingYears: [2024, 2025],
          positions: [
            { title: 'Software Developer', vacancies: 15, salary: '₹8-12 LPA', description: 'Responsible for developing and maintaining software applications.' },
            { title: 'QA Engineer', vacancies: 10, salary: '₹6-9 LPA', description: 'Ensure quality of software products through testing.' }
          ],
          vacancies: 25,
          registeredCount: 156,
          status: 'scheduled',
          description: 'Tech Mahindra is conducting a campus drive for final year students. They are looking for talented individuals with strong programming skills and a passion for technology. Selected candidates will undergo comprehensive training before deployment.',
          requirements: [
            'Strong programming skills in Java/Python',
            'Good understanding of data structures and algorithms',
            'Excellent communication skills',
            'Problem-solving ability',
            'Team player'
          ],
          benefits: [
            'Competitive salary package',
            'Health insurance',
            'Performance bonuses',
            'Learning and development programs',
            'Global exposure'
          ],
          registrationDeadline: '2024-04-10',
          contactPerson: 'HR Manager',
          contactEmail: 'hr@techmahindra.com',
          contactPhone: '+91 1234567890',
          additionalNotes: 'Candidates must bring a copy of their resume and academic transcripts. Dress code: Formals.'
        },
        '2': {
          id: 2,
          driveName: 'Infosys Virtual Drive',
          driveType: 'virtual',
          companyName: 'Infosys',
          companyLogo: 'https://via.placeholder.com/100x100?text=INF',
          companyDescription: 'Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation.',
          industry: 'IT Services',
          companySize: '250,000+ employees',
          headquarters: 'Bengaluru, India',
          founded: '1981',
          website: 'https://www.infosys.com',
          driveDate: '2024-04-20',
          driveTime: '11:00 AM',
          venue: 'Online - Microsoft Teams',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
          minCGPA: 6.5,
          passingYears: [2024],
          positions: [
            { title: 'System Engineer', vacancies: 30, salary: '₹4-6 LPA', description: 'System administration and support role.' },
            { title: 'Digital Specialist', vacancies: 20, salary: '₹7-10 LPA', description: 'Digital transformation specialist.' }
          ],
          vacancies: 50,
          registeredCount: 342,
          status: 'scheduled',
          description: 'Infosys is hiring fresh graduates for multiple roles across different domains. Candidates with good communication skills and technical knowledge are preferred. This is a virtual drive conducted entirely online.',
          requirements: [
            'Good academic record',
            'Strong analytical skills',
            'Excellent communication skills',
            'Basic programming knowledge',
            'Adaptability and learning ability'
          ],
          benefits: [
            'Comprehensive training program',
            'Work-life balance',
            'Career growth opportunities',
            'Global mobility',
            'Employee wellness programs'
          ],
          registrationDeadline: '2024-04-15',
          contactPerson: 'Recruitment Team',
          contactEmail: 'careers@infosys.com',
          contactPhone: '+91 9876543210',
          additionalNotes: 'The drive will be conducted entirely online. Ensure you have a stable internet connection.'
        },
        '3': {
          id: 3,
          driveName: 'Amazon Off-Campus Drive',
          driveType: 'offCampus',
          companyName: 'Amazon',
          companyLogo: 'https://via.placeholder.com/100x100?text=AMZ',
          companyDescription: 'Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.',
          industry: 'E-commerce & Cloud Computing',
          companySize: '1,500,000+ employees',
          headquarters: 'Seattle, USA',
          founded: '1994',
          website: 'https://www.amazon.com',
          driveDate: '2024-04-05',
          driveTime: '09:30 AM',
          venue: 'Conference Room - Block B',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Data Science'],
          minCGPA: 7.5,
          passingYears: [2023, 2024],
          positions: [
            { title: 'Software Development Engineer', vacancies: 15, salary: '₹15-25 LPA', description: 'Design and develop scalable software solutions.' }
          ],
          vacancies: 15,
          registeredCount: 89,
          status: 'ongoing',
          description: 'Amazon is looking for talented software engineers who are passionate about building scalable solutions. This is a great opportunity to work on cutting-edge technologies.',
          requirements: [
            'Strong coding skills in Java/C++',
            'Understanding of system design',
            'Problem-solving expertise',
            'Experience with cloud technologies',
            'Strong DSA knowledge'
          ],
          benefits: [
            'Highly competitive salary',
            'Stock options',
            'Flexible work environment',
            'Learning budget',
            'Relocation assistance'
          ],
          registrationDeadline: '2024-04-01',
          contactPerson: 'Technical Recruiter',
          contactEmail: 'tech-recruit@amazon.com',
          contactPhone: '+91 1122334455',
          additionalNotes: 'The drive is currently ongoing. Shortlisted candidates will be notified via email.'
        }
      };
      
      if (this.driveId && mockDrives[this.driveId]) {
        this.drive = mockDrives[this.driveId];
        this.updateRegistrationStats();
        this.isLoading = false;
      } else {
        this.error = 'Drive not found';
        this.isLoading = false;
      }
    }, 1000);
  }

  private updateRegistrationStats(): void {
    this.registrationStats.totalRegistered = this.drive.registeredCount;
    this.registrationStats.totalVacancies = this.drive.vacancies;
    this.registrationStats.applicationRate = (this.drive.registeredCount / this.drive.vacancies) * 100;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'scheduled': return 'schedule';
      case 'ongoing': return 'play_circle';
      case 'completed': return 'check_circle';
      case 'cancelled': return 'cancel';
      default: return 'info';
    }
  }

  getDriveTypeIcon(type: string): string {
    switch (type) {
      case 'onCampus': return 'business';
      case 'offCampus': return 'location_city';
      case 'virtual': return 'computer';
      case 'hybrid': return 'sync';
      default: return 'event';
    }
  }

  getDaysRemaining(date: string): number {
    const eventDate = new Date(date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  isRegistrationOpen(): boolean {
    if (!this.drive) return false;
    return this.drive.status === 'scheduled' && new Date(this.drive.registrationDeadline) > new Date();
  }

  openApplicationForm(): void {
    if (this.isRegistrationOpen()) {
      this.showApplicationForm = true;
    }
  }

  closeApplicationForm(): void {
    this.showApplicationForm = false;
    this.resetApplicationForm();
  }

  resetApplicationForm(): void {
    this.applicationForm = {
      fullName: '',
      email: '',
      phone: '',
      rollNumber: '',
      branch: '',
      passingYear: '',
      cgpa: null,
      resumeLink: '',
      coverLetter: '',
      additionalInfo: ''
    };
  }

  submitApplication(): void {
    if (this.validateApplicationForm()) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.showApplicationForm = false;
        alert('Application submitted successfully! You will receive a confirmation email shortly.');
        this.resetApplicationForm();
      }, 1500);
    }
  }

  validateApplicationForm(): boolean {
    if (!this.applicationForm.fullName.trim()) {
      alert('Please enter your full name');
      return false;
    }
    if (!this.applicationForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!this.applicationForm.phone.match(/^[0-9]{10}$/)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!this.applicationForm.rollNumber.trim()) {
      alert('Please enter your roll number');
      return false;
    }
    if (!this.applicationForm.branch) {
      alert('Please select your branch');
      return false;
    }
    if (!this.applicationForm.passingYear) {
      alert('Please select your passing year');
      return false;
    }
    if (this.applicationForm.cgpa && (this.applicationForm.cgpa < 0 || this.applicationForm.cgpa > 10)) {
      alert('CGPA must be between 0 and 10');
      return false;
    }
    return true;
  }

  toggleFAQ(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  goBack(): void {
    this.router.navigate(['/company/drives']);
  }

  shareDrive(): void {
    if (navigator.share) {
      navigator.share({
        title: this.drive.driveName,
        text: `Join ${this.drive.driveName} at ${this.drive.companyName}`,
        url: window.location.href
      }).catch(() => {
        this.copyToClipboard();
      });
    } else {
      this.copyToClipboard();
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  }

  get passingYearsOptions(): number[] {
    return [2023, 2024, 2025, 2026];
  }

  get branchOptions(): string[] {
    return [
      'Computer Science',
      'Information Technology',
      'Electronics & Communication',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Chemical Engineering',
      'Biotechnology',
      'Data Science',
      'Artificial Intelligence'
    ];
  }
}