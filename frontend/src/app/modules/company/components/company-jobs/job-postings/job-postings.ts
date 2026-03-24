import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-postings',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './job-postings.html',
  styleUrl: './job-postings.css',
})
export class JobPostingsComponent implements OnInit {
  // Job listings data
  jobs: any[] = [];
  filteredJobs: any[] = [];
  isLoading = true;
  
  // Filter properties
  searchTerm = '';
  selectedType = 'all';
  selectedLocation = 'all';
  selectedExperience = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;
  
  // Job types for filter
  jobTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'fulltime', label: 'Full Time' },
    { value: 'parttime', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' }
  ];
  
  // Locations for filter
  locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' }
  ];
  
  // Experience levels
  experienceLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6+ years)' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  private loadJobs(): void {
    // Simulate API call - replace with actual service call
    setTimeout(() => {
      this.jobs = [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          company: 'TechCorp Solutions',
          companyLogo: 'https://via.placeholder.com/60x60?text=TC',
          location: 'remote',
          type: 'fulltime',
          experience: 'senior',
          salary: '$80,000 - $120,000',
          description: 'We are looking for an experienced Frontend Developer with strong Angular skills to join our dynamic team.',
          requirements: ['Angular', 'TypeScript', 'RxJS', 'HTML5', 'CSS3'],
          postedDate: '2024-03-15',
          deadline: '2024-04-15',
          applicants: 45,
          featured: true,
          tags: ['Angular', 'Remote', 'Senior']
        },
        {
          id: 2,
          title: 'Full Stack Developer',
          company: 'Innovate Labs',
          companyLogo: 'https://via.placeholder.com/60x60?text=IL',
          location: 'hybrid',
          type: 'fulltime',
          experience: 'mid',
          salary: '$70,000 - $95,000',
          description: 'Join our innovative team to build cutting-edge web applications using modern technologies.',
          requirements: ['Node.js', 'React', 'MongoDB', 'Express', 'AWS'],
          postedDate: '2024-03-10',
          deadline: '2024-04-10',
          applicants: 32,
          featured: false,
          tags: ['Node.js', 'React', 'AWS']
        },
        {
          id: 3,
          title: 'UI/UX Designer',
          company: 'Creative Studio',
          companyLogo: 'https://via.placeholder.com/60x60?text=CS',
          location: 'remote',
          type: 'parttime',
          experience: 'mid',
          salary: '$40 - $60 per hour',
          description: 'Seeking a creative UI/UX Designer to create beautiful and intuitive user experiences.',
          requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
          postedDate: '2024-03-12',
          deadline: '2024-04-12',
          applicants: 28,
          featured: false,
          tags: ['Figma', 'UX Design', 'Remote']
        },
        {
          id: 4,
          title: 'Software Development Intern',
          company: 'StartUp Hub',
          companyLogo: 'https://via.placeholder.com/60x60?text=SH',
          location: 'onsite',
          type: 'internship',
          experience: 'entry',
          salary: '$25,000 - $30,000',
          description: 'Great opportunity for fresh graduates to kickstart their career in software development.',
          requirements: ['JavaScript', 'Python', 'SQL', 'Git', 'Problem Solving'],
          postedDate: '2024-03-14',
          deadline: '2024-04-14',
          applicants: 67,
          featured: true,
          tags: ['Internship', 'Entry Level', 'On-site']
        },
        {
          id: 5,
          title: 'DevOps Engineer',
          company: 'Cloud Systems Inc',
          companyLogo: 'https://via.placeholder.com/60x60?text=CSI',
          location: 'hybrid',
          type: 'fulltime',
          experience: 'senior',
          salary: '$100,000 - $140,000',
          description: 'Experienced DevOps Engineer needed to manage and optimize our cloud infrastructure.',
          requirements: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
          postedDate: '2024-03-08',
          deadline: '2024-04-08',
          applicants: 23,
          featured: false,
          tags: ['AWS', 'Kubernetes', 'DevOps']
        },
        {
          id: 6,
          title: 'Data Analyst',
          company: 'Data Insights Co',
          companyLogo: 'https://via.placeholder.com/60x60?text=DI',
          location: 'remote',
          type: 'fulltime',
          experience: 'mid',
          salary: '$65,000 - $85,000',
          description: 'Looking for a Data Analyst to turn data into actionable business insights.',
          requirements: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'],
          postedDate: '2024-03-11',
          deadline: '2024-04-11',
          applicants: 41,
          featured: false,
          tags: ['SQL', 'Python', 'Tableau']
        }
      ];
      
      this.filteredJobs = [...this.jobs];
      this.calculateTotalPages();
      this.isLoading = false;
    }, 1000);
  }

  applyFilters(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'all' || job.type === this.selectedType;
      const matchesLocation = this.selectedLocation === 'all' || job.location === this.selectedLocation;
      const matchesExperience = this.selectedExperience === 'all' || job.experience === this.selectedExperience;
      
      return matchesSearch && matchesType && matchesLocation && matchesExperience;
    });
    
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  get paginatedJobs(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredJobs.slice(startIndex, startIndex + this.itemsPerPage);
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
    this.selectedType = 'all';
    this.selectedLocation = 'all';
    this.selectedExperience = 'all';
    this.applyFilters();
  }

  // ✅ Add these missing methods
  viewDetails(jobId: number): void {
    // Navigate to job details page
    this.router.navigate(['/jobs', jobId]);
    // Or if you want to show a modal/dialog
    console.log('View details for job:', jobId);
    // You can also emit an event or open a modal
    alert(`Viewing details for job ID: ${jobId}`);
  }

  applyNow(jobId: number): void {
    // Check if job is expired
    const job = this.jobs.find(j => j.id === jobId);
    if (job && this.isExpired(job.deadline)) {
      alert('This job posting has expired. You cannot apply for this position.');
      return;
    }
    
    // Navigate to application form
    this.router.navigate(['/jobs', jobId, 'apply']);
    // Or if you want to open application modal
    console.log('Applying for job:', jobId);
    alert(`Starting application process for job ID: ${jobId}`);
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'fulltime': return 'type-fulltime';
      case 'parttime': return 'type-parttime';
      case 'internship': return 'type-internship';
      case 'contract': return 'type-contract';
      default: return '';
    }
  }

  getLocationIcon(location: string): string {
    switch (location) {
      case 'remote': return 'home';
      case 'hybrid': return 'sync';
      case 'onsite': return 'business';
      default: return 'location_on';
    }
  }

  getExperienceLabel(experience: string): string {
    switch (experience) {
      case 'entry': return 'Entry Level';
      case 'mid': return 'Mid Level';
      case 'senior': return 'Senior Level';
      default: return 'All Levels';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  getDaysRemaining(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isUrgent(deadline: string): boolean {
    const daysRemaining = this.getDaysRemaining(deadline);
    return daysRemaining <= 7 && daysRemaining > 0;
  }

  isExpired(deadline: string): boolean {
    return this.getDaysRemaining(deadline) < 0;
  }
}