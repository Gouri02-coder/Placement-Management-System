import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-schedule-drive',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './schedule-drive.html',
  styleUrl: './schedule-drive.css',
})
export class ScheduleDrive implements OnInit {
  // ✅ Add this property - it was missing
  activeTab: string = 'schedule'; // Default to 'schedule' tab
  
  driveForm: FormGroup;
  isSubmitting = false;
  drives: any[] = [];
  filteredDrives: any[] = [];
  isLoading = true;
  
  // Filter properties
  searchTerm = '';
  selectedStatus = 'all';
  selectedType = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  
  // Form options
  driveTypes = [
    { value: 'onCampus', label: 'On-Campus Drive' },
    { value: 'offCampus', label: 'Off-Campus Drive' },
    { value: 'virtual', label: 'Virtual Drive' },
    { value: 'hybrid', label: 'Hybrid Drive' }
  ];
  
  driveStatuses = [
    { value: 'scheduled', label: 'Scheduled', class: 'status-scheduled' },
    { value: 'ongoing', label: 'Ongoing', class: 'status-ongoing' },
    { value: 'completed', label: 'Completed', class: 'status-completed' },
    { value: 'cancelled', label: 'Cancelled', class: 'status-cancelled' }
  ];
  
  branches = [
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
  
  venues = [
    'Main Auditorium',
    'Seminar Hall - Block A',
    'Conference Room - Block B',
    'Online - Microsoft Teams',
    'Online - Zoom',
    'Hybrid Mode'
  ];

  constructor(private fb: FormBuilder) {
    this.driveForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDrives();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      driveName: ['', [Validators.required, Validators.minLength(5)]],
      driveType: ['onCampus', [Validators.required]],
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      companyWebsite: ['', [Validators.pattern('https?://.+')]],
      driveDate: ['', [Validators.required]],
      driveTime: ['', [Validators.required]],
      venue: ['', [Validators.required]],
      eligibleBranches: [[], [Validators.required, Validators.minLength(1)]],
      minCGPA: [null, [Validators.min(0), Validators.max(10)]],
      passingYears: [[], [Validators.required]],
      positions: ['', [Validators.required]],
      vacancies: [null, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      requirements: ['', [Validators.required, Validators.minLength(30)]],
      registrationDeadline: ['', [Validators.required]],
      contactPerson: ['', [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      additionalNotes: ['']
    }, { validators: this.dateValidator });
  }

  private dateValidator(group: FormGroup): any {
    const driveDate = group.get('driveDate')?.value;
    const registrationDeadline = group.get('registrationDeadline')?.value;
    
    if (driveDate && registrationDeadline) {
      if (new Date(registrationDeadline) >= new Date(driveDate)) {
        return { deadlineAfterDrive: true };
      }
    }
    return null;
  }

  private loadDrives(): void {
    // Simulate API call - replace with actual service
    setTimeout(() => {
      this.drives = [
        {
          id: 1,
          driveName: 'Tech Mahindra Campus Drive',
          driveType: 'onCampus',
          companyName: 'Tech Mahindra',
          companyLogo: 'https://via.placeholder.com/50x50?text=TM',
          driveDate: '2024-04-15',
          driveTime: '10:00 AM',
          venue: 'Main Auditorium',
          eligibleBranches: ['Computer Science', 'Information Technology'],
          minCGPA: 7.0,
          passingYears: [2024, 2025],
          positions: 'Software Developer, QA Engineer',
          vacancies: 25,
          registeredCount: 156,
          status: 'scheduled',
          description: 'Tech Mahindra is conducting a campus drive for final year students.',
          registrationDeadline: '2024-04-10',
          contactPerson: 'HR Manager',
          contactEmail: 'hr@techmahindra.com',
          contactPhone: '1234567890'
        },
        {
          id: 2,
          driveName: 'Infosys Virtual Drive',
          driveType: 'virtual',
          companyName: 'Infosys',
          companyLogo: 'https://via.placeholder.com/50x50?text=INF',
          driveDate: '2024-04-20',
          driveTime: '11:00 AM',
          venue: 'Online - Microsoft Teams',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
          minCGPA: 6.5,
          passingYears: [2024],
          positions: 'System Engineer, Digital Specialist',
          vacancies: 50,
          registeredCount: 342,
          status: 'scheduled',
          description: 'Infosys is hiring fresh graduates for multiple roles.',
          registrationDeadline: '2024-04-15',
          contactPerson: 'Recruitment Team',
          contactEmail: 'careers@infosys.com',
          contactPhone: '9876543210'
        },
        {
          id: 3,
          driveName: 'Amazon Off-Campus Drive',
          driveType: 'offCampus',
          companyName: 'Amazon',
          companyLogo: 'https://via.placeholder.com/50x50?text=AMZ',
          driveDate: '2024-04-05',
          driveTime: '09:30 AM',
          venue: 'Conference Room - Block B',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Data Science'],
          minCGPA: 7.5,
          passingYears: [2023, 2024],
          positions: 'Software Development Engineer',
          vacancies: 15,
          registeredCount: 89,
          status: 'ongoing',
          description: 'Amazon is looking for talented software engineers.',
          registrationDeadline: '2024-04-01',
          contactPerson: 'Technical Recruiter',
          contactEmail: 'tech-recruit@amazon.com',
          contactPhone: '1122334455'
        },
        {
          id: 4,
          driveName: 'TCS NQT Drive',
          driveType: 'hybrid',
          companyName: 'TCS',
          companyLogo: 'https://via.placeholder.com/50x50?text=TCS',
          driveDate: '2024-03-25',
          driveTime: '02:00 PM',
          venue: 'Hybrid Mode',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical'],
          minCGPA: 6.0,
          passingYears: [2024],
          positions: 'Assistant System Engineer',
          vacancies: 100,
          registeredCount: 567,
          status: 'completed',
          description: 'TCS National Qualifier Test recruitment drive.',
          registrationDeadline: '2024-03-20',
          contactPerson: 'HR Department',
          contactEmail: 'hr@tcs.com',
          contactPhone: '9988776655'
        }
      ];
      
      this.filteredDrives = [...this.drives];
      this.calculateTotalPages();
      this.isLoading = false;
    }, 1000);
  }

  applyFilters(): void {
    this.filteredDrives = this.drives.filter(drive => {
      const matchesSearch = drive.driveName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           drive.companyName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || drive.status === this.selectedStatus;
      const matchesType = this.selectedType === 'all' || drive.driveType === this.selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredDrives.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  get paginatedDrives(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDrives.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedType = 'all';
    this.applyFilters();
  }

  onSubmit(): void {
    if (this.driveForm.valid) {
      this.isSubmitting = true;
      const formValue = this.driveForm.value;
      
      const newDrive = {
        id: Date.now(),
        ...formValue,
        registeredCount: 0,
        status: 'scheduled',
        companyLogo: `https://via.placeholder.com/50x50?text=${formValue.companyName.substring(0, 3)}`
      };
      
      // Simulate API call
      setTimeout(() => {
        this.drives.unshift(newDrive);
        this.applyFilters();
        this.isSubmitting = false;
        this.driveForm.reset(this.createForm().value);
        alert('Drive scheduled successfully!');
        this.resetForm();
      }, 1000);
    } else {
      this.markFormGroupTouched(this.driveForm);
      this.scrollToFirstError();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  private scrollToFirstError(): void {
    const firstError = document.querySelector('.error-message');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  resetForm(): void {
    this.driveForm.reset({
      driveType: 'onCampus',
      eligibleBranches: [],
      passingYears: [],
      driveTime: '',
      vacancies: null
    });
  }

  cancel(): void {
    if (this.driveForm.dirty) {
      if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        this.resetForm();
      }
    } else {
      this.resetForm();
    }
  }

  viewDetails(drive: any): void {
    console.log('View details for drive:', drive);
    alert(`Viewing details for ${drive.driveName}`);
  }

  editDrive(drive: any): void {
    console.log('Edit drive:', drive);
    alert(`Editing ${drive.driveName}`);
  }

  cancelDrive(drive: any): void {
    if (confirm(`Are you sure you want to cancel ${drive.driveName}?`)) {
      console.log('Cancel drive:', drive);
      alert(`${drive.driveName} has been cancelled.`);
    }
  }

  // Form field getters
  get driveName() { return this.driveForm.get('driveName'); }
  get driveType() { return this.driveForm.get('driveType'); }
  get companyName() { return this.driveForm.get('companyName'); }
  get companyWebsite() { return this.driveForm.get('companyWebsite'); }
  get driveDate() { return this.driveForm.get('driveDate'); }
  get driveTime() { return this.driveForm.get('driveTime'); }
  get venue() { return this.driveForm.get('venue'); }
  get eligibleBranches() { return this.driveForm.get('eligibleBranches'); }
  get minCGPA() { return this.driveForm.get('minCGPA'); }
  get passingYears() { return this.driveForm.get('passingYears'); }
  get positions() { return this.driveForm.get('positions'); }
  get vacancies() { return this.driveForm.get('vacancies'); }
  get description() { return this.driveForm.get('description'); }
  get requirements() { return this.driveForm.get('requirements'); }
  get registrationDeadline() { return this.driveForm.get('registrationDeadline'); }
  get contactPerson() { return this.driveForm.get('contactPerson'); }
  get contactEmail() { return this.driveForm.get('contactEmail'); }
  get contactPhone() { return this.driveForm.get('contactPhone'); }
  get additionalNotes() { return this.driveForm.get('additionalNotes'); }

  get selectedBranches(): string[] {
    return this.driveForm.get('eligibleBranches')?.value || [];
  }

  get selectedYears(): number[] {
    return this.driveForm.get('passingYears')?.value || [];
  }

  toggleBranch(branch: string): void {
    const branches = [...this.selectedBranches];
    const index = branches.indexOf(branch);
    
    if (index > -1) {
      branches.splice(index, 1);
    } else {
      branches.push(branch);
    }
    
    this.driveForm.get('eligibleBranches')?.setValue(branches);
  }

  toggleYear(year: number): void {
    const years = [...this.selectedYears];
    const index = years.indexOf(year);
    
    if (index > -1) {
      years.splice(index, 1);
    } else {
      years.push(year);
    }
    
    this.driveForm.get('passingYears')?.setValue(years);
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
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  get registrationMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}