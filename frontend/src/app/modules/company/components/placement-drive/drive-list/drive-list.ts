import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-drive-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './drive-list.html',
  styleUrl: './drive-list.css',
})
export class DriveList implements OnInit {
  drives: any[] = [];
  filteredDrives: any[] = [];
  isLoading = true;
  
  // Filter properties
  searchTerm = '';
  selectedStatus = 'all';
  selectedType = 'all';
  selectedBranch = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;
  
  // Statistics
  stats = {
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0
  };
  
  // Filter options
  driveTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'onCampus', label: 'On-Campus' },
    { value: 'offCampus', label: 'Off-Campus' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' }
  ];
  
  driveStatuses = [
    { value: 'all', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
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

  constructor() {}

  ngOnInit(): void {
    this.loadDrives();
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
          companyLogo: 'https://via.placeholder.com/60x60?text=TM',
          driveDate: '2024-04-15',
          driveTime: '10:00 AM',
          venue: 'Main Auditorium',
          eligibleBranches: ['Computer Science', 'Information Technology'],
          minCGPA: 7.0,
          passingYears: [2024, 2025],
          positions: ['Software Developer', 'QA Engineer'],
          vacancies: 25,
          registeredCount: 156,
          status: 'scheduled',
          description: 'Tech Mahindra is conducting a campus drive for final year students. They are looking for talented individuals with strong programming skills.',
          registrationDeadline: '2024-04-10',
          contactPerson: 'HR Manager',
          contactEmail: 'hr@techmahindra.com',
          contactPhone: '+91 1234567890'
        },
        {
          id: 2,
          driveName: 'Infosys Virtual Drive',
          driveType: 'virtual',
          companyName: 'Infosys',
          companyLogo: 'https://via.placeholder.com/60x60?text=INF',
          driveDate: '2024-04-20',
          driveTime: '11:00 AM',
          venue: 'Online - Microsoft Teams',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
          minCGPA: 6.5,
          passingYears: [2024],
          positions: ['System Engineer', 'Digital Specialist'],
          vacancies: 50,
          registeredCount: 342,
          status: 'scheduled',
          description: 'Infosys is hiring fresh graduates for multiple roles. Candidates with good communication skills and technical knowledge are preferred.',
          registrationDeadline: '2024-04-15',
          contactPerson: 'Recruitment Team',
          contactEmail: 'careers@infosys.com',
          contactPhone: '+91 9876543210'
        },
        {
          id: 3,
          driveName: 'Amazon Off-Campus Drive',
          driveType: 'offCampus',
          companyName: 'Amazon',
          companyLogo: 'https://via.placeholder.com/60x60?text=AMZ',
          driveDate: '2024-04-05',
          driveTime: '09:30 AM',
          venue: 'Conference Room - Block B',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Data Science'],
          minCGPA: 7.5,
          passingYears: [2023, 2024],
          positions: ['Software Development Engineer'],
          vacancies: 15,
          registeredCount: 89,
          status: 'ongoing',
          description: 'Amazon is looking for talented software engineers who are passionate about building scalable solutions.',
          registrationDeadline: '2024-04-01',
          contactPerson: 'Technical Recruiter',
          contactEmail: 'tech-recruit@amazon.com',
          contactPhone: '+91 1122334455'
        },
        {
          id: 4,
          driveName: 'TCS NQT Drive',
          driveType: 'hybrid',
          companyName: 'TCS',
          companyLogo: 'https://via.placeholder.com/60x60?text=TCS',
          driveDate: '2024-03-25',
          driveTime: '02:00 PM',
          venue: 'Hybrid Mode',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical'],
          minCGPA: 6.0,
          passingYears: [2024],
          positions: ['Assistant System Engineer', 'IT Analyst'],
          vacancies: 100,
          registeredCount: 567,
          status: 'completed',
          description: 'TCS National Qualifier Test recruitment drive for fresh graduates across various disciplines.',
          registrationDeadline: '2024-03-20',
          contactPerson: 'HR Department',
          contactEmail: 'hr@tcs.com',
          contactPhone: '+91 9988776655'
        },
        {
          id: 5,
          driveName: 'Microsoft Campus Drive',
          driveType: 'onCampus',
          companyName: 'Microsoft',
          companyLogo: 'https://via.placeholder.com/60x60?text=MS',
          driveDate: '2024-05-10',
          driveTime: '10:30 AM',
          venue: 'Seminar Hall - Block A',
          eligibleBranches: ['Computer Science', 'Information Technology'],
          minCGPA: 8.0,
          passingYears: [2024],
          positions: ['Software Engineer', 'Program Manager'],
          vacancies: 20,
          registeredCount: 210,
          status: 'scheduled',
          description: 'Microsoft is coming for campus recruitment. Looking for exceptional coding skills and problem-solving abilities.',
          registrationDeadline: '2024-05-05',
          contactPerson: 'Campus Recruitment Team',
          contactEmail: 'campus@microsoft.com',
          contactPhone: '+91 5566778899'
        },
        {
          id: 6,
          driveName: 'Google Virtual Drive',
          driveType: 'virtual',
          companyName: 'Google',
          companyLogo: 'https://via.placeholder.com/60x60?text=GOOG',
          driveDate: '2024-05-15',
          driveTime: '11:00 AM',
          venue: 'Online - Google Meet',
          eligibleBranches: ['Computer Science', 'Information Technology', 'Data Science'],
          minCGPA: 8.5,
          passingYears: [2024],
          positions: ['Software Developer', 'Data Analyst'],
          vacancies: 10,
          registeredCount: 450,
          status: 'scheduled',
          description: 'Google is conducting a virtual drive for top performers. Exceptional coding and analytical skills required.',
          registrationDeadline: '2024-05-10',
          contactPerson: 'Talent Acquisition',
          contactEmail: 'talent@google.com',
          contactPhone: '+91 4455667788'
        }
      ];
      
      this.filteredDrives = [...this.drives];
      this.updateStats();
      this.calculateTotalPages();
      this.isLoading = false;
    }, 1000);
  }

  private updateStats(): void {
    this.stats.total = this.drives.length;
    this.stats.upcoming = this.drives.filter(d => d.status === 'scheduled').length;
    this.stats.ongoing = this.drives.filter(d => d.status === 'ongoing').length;
    this.stats.completed = this.drives.filter(d => d.status === 'completed').length;
  }

  applyFilters(): void {
    this.filteredDrives = this.drives.filter(drive => {
      const matchesSearch = drive.driveName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           drive.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           drive.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || drive.status === this.selectedStatus;
      const matchesType = this.selectedType === 'all' || drive.driveType === this.selectedType;
      const matchesBranch = this.selectedBranch === 'all' || drive.eligibleBranches.includes(this.selectedBranch);
      
      return matchesSearch && matchesStatus && matchesType && matchesBranch;
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
    this.selectedBranch = 'all';
    this.applyFilters();
  }

  viewDetails(drive: any): void {
    console.log('View details for drive:', drive);
    alert(`Viewing details for ${drive.driveName}`);
    // Navigate to details page
    // this.router.navigate(['/company/drives', drive.id]);
  }

  registerForDrive(drive: any): void {
    if (drive.status === 'scheduled' && new Date(drive.registrationDeadline) > new Date()) {
      console.log('Registering for drive:', drive);
      alert(`You have successfully registered for ${drive.driveName}!`);
    } else if (drive.status === 'ongoing') {
      alert(`Registration is currently closed for ${drive.driveName}. The drive is already ongoing.`);
    } else if (drive.status === 'completed') {
      alert(`${drive.driveName} has already been completed.`);
    } else if (new Date(drive.registrationDeadline) <= new Date()) {
      alert(`Registration deadline for ${drive.driveName} has passed.`);
    }
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
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  isRegistrationOpen(deadline: string, status: string): boolean {
    return status === 'scheduled' && new Date(deadline) > new Date();
  }
}