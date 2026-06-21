export interface CompanyPortalContext {
  companyName: string;
  companyBadge: string;
  companyDomain: string;
}

export interface CompanyDriveRole {
  id: string;
  title: string;
  team: string;
  openings: number;
  targetApplications: number;
  applications: number;
  shortlisted: number;
  interviews: number;
  offers: number;
  averagePackageLpa: number;
  packageRange: string;
  workMode: string;
  hiringManager: string;
  skills: string[];
  responsibilities: string[];
}

export interface CompanyDriveRound {
  id: string;
  name: string;
  date: string;
  mode: string;
  owner: string;
  description: string;
  completed: boolean;
}

export interface CompanyDriveRecord {
  id: number;
  driveCode: string;
  driveName: string;
  driveType: 'onCampus' | 'offCampus' | 'virtual' | 'hybrid';
  companyName: string;
  companyBadge: string;
  driveDate: string;
  driveTime: string;
  venue: string;
  eligibleBranches: string[];
  minCGPA: number;
  passingYears: number[];
  registrationDeadline: string;
  description: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  vacancies: number;
  registeredCount: number;
  interviewCount: number;
  offerCount: number;
  targetApplications: number;
  website: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  notes: string[];
  hiringSignals: string[];
  rounds: CompanyDriveRound[];
  roles: CompanyDriveRole[];
}

export interface CompanyAnalyticsActivity {
  id: number;
  candidateName: string;
  roleTitle: string;
  driveCode: string;
  branch: string;
  stage: string;
  updatedOn: string;
}

export interface CompanyAnalyticsAlert {
  id: number;
  type: 'success' | 'info' | 'warning';
  message: string;
  time: string;
}

function sanitizeCompanyDomain(companyName: string): string {
  const normalized = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  return normalized ? `${normalized}.com` : 'company.com';
}

function getCompanyBadge(companyName: string): string {
  const parts = companyName.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'CMP';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase();
  }

  return parts
    .slice(0, 3)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function getCompanyPortalContext(): CompanyPortalContext {
  let companyName = 'Infosys';

  try {
    const rawUser = localStorage.getItem('currentUser');
    if (rawUser) {
      const parsedUser = JSON.parse(rawUser);
      if (typeof parsedUser?.companyName === 'string' && parsedUser.companyName.trim()) {
        companyName = parsedUser.companyName.trim();
      }
    }
  } catch {
    // Fall back to the default demo company context.
  }

  return {
    companyName,
    companyBadge: getCompanyBadge(companyName),
    companyDomain: sanitizeCompanyDomain(companyName),
  };
}

export function getCompanyDrives(): CompanyDriveRecord[] {
  const context = getCompanyPortalContext();
  const careersEmail = `careers@${context.companyDomain}`;
  const hiringEmail = `campus-hiring@${context.companyDomain}`;

  return [
    {
      id: 1,
      driveCode: 'DX-APR-26',
      driveName: 'Digital Experience Hiring Drive',
      driveType: 'hybrid',
      companyName: context.companyName,
      companyBadge: context.companyBadge,
      driveDate: '2026-04-18',
      driveTime: '10:00 AM',
      venue: 'Bengaluru Hub + Teams',
      eligibleBranches: ['Computer Science', 'Information Technology', 'Data Science'],
      minCGPA: 7.5,
      passingYears: [2026, 2027],
      registrationDeadline: '2026-04-13',
      description: 'A focused drive for digital product roles covering frontend engineering, UI systems, and accessibility QA for the experience platform team.',
      status: 'scheduled',
      vacancies: 18,
      registeredCount: 164,
      interviewCount: 42,
      offerCount: 0,
      targetApplications: 180,
      website: `https://www.${context.companyDomain}`,
      contactPerson: 'Campus Hiring Lead',
      contactEmail: careersEmail,
      contactPhone: '+91 98765 43210',
      notes: [
        'Keep portfolio and resume review enabled for the frontend stream.',
        'Accessibility exercise should be added to the UI Engineer round.',
      ],
      hiringSignals: ['High portfolio quality', 'Strong Angular depth', 'Design-system experience'],
      rounds: [
        {
          id: 'dx-r1',
          name: 'Resume + Portfolio Screen',
          date: '2026-04-14',
          mode: 'Virtual',
          owner: 'Talent Team',
          description: 'Initial screening for frontend and design-system depth.',
          completed: false,
        },
        {
          id: 'dx-r2',
          name: 'Frontend Technical Interview',
          date: '2026-04-18',
          mode: 'Hybrid',
          owner: 'Experience Engineering',
          description: 'Hands-on evaluation with Angular, TypeScript, and UI architecture.',
          completed: false,
        },
        {
          id: 'dx-r3',
          name: 'Manager Conversation',
          date: '2026-04-19',
          mode: 'Hybrid',
          owner: 'Product Leadership',
          description: 'Final alignment on role, team, and offer readiness.',
          completed: false,
        },
      ],
      roles: [
        {
          id: 'dx-role-1',
          title: 'Frontend Engineer',
          team: 'Digital Experience',
          openings: 8,
          targetApplications: 90,
          applications: 82,
          shortlisted: 24,
          interviews: 18,
          offers: 0,
          averagePackageLpa: 9.8,
          packageRange: 'INR 8-12 LPA',
          workMode: 'Hybrid',
          hiringManager: 'Ananya Rao',
          skills: ['Angular', 'TypeScript', 'RxJS', 'Testing'],
          responsibilities: [
            'Build recruiter and student workflows in Angular.',
            'Own reusable UI modules and responsive delivery.',
            'Partner with product and design for releases.',
          ],
        },
        {
          id: 'dx-role-2',
          title: 'UI Engineer',
          team: 'Design Systems',
          openings: 5,
          targetApplications: 54,
          applications: 47,
          shortlisted: 11,
          interviews: 9,
          offers: 0,
          averagePackageLpa: 8.9,
          packageRange: 'INR 7-10 LPA',
          workMode: 'Hybrid',
          hiringManager: 'Ritika Sen',
          skills: ['HTML', 'CSS', 'Figma', 'Accessibility'],
          responsibilities: [
            'Ship design-system components for shared product surfaces.',
            'Improve accessibility and responsive behavior.',
            'Support visual QA before launch.',
          ],
        },
        {
          id: 'dx-role-3',
          title: 'Accessibility QA Analyst',
          team: 'Quality Engineering',
          openings: 5,
          targetApplications: 36,
          applications: 35,
          shortlisted: 7,
          interviews: 5,
          offers: 0,
          averagePackageLpa: 6.8,
          packageRange: 'INR 5.5-7.5 LPA',
          workMode: 'Hybrid',
          hiringManager: 'Neha Kapoor',
          skills: ['WCAG', 'Manual Testing', 'Jira', 'Automation'],
          responsibilities: [
            'Validate accessibility conformance across student products.',
            'Prepare QA reports and regression notes.',
            'Collaborate with frontend teams on issue closure.',
          ],
        },
      ],
    },
    {
      id: 2,
      driveCode: 'PE-APR-26',
      driveName: 'Platform Engineering Drive',
      driveType: 'onCampus',
      companyName: context.companyName,
      companyBadge: context.companyBadge,
      driveDate: '2026-04-08',
      driveTime: '09:30 AM',
      venue: 'Main Auditorium',
      eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
      minCGPA: 7.2,
      passingYears: [2026, 2027],
      registrationDeadline: '2026-04-03',
      description: 'Core engineering drive for backend, cloud platform, and reliability roles supporting enterprise-scale product workloads.',
      status: 'ongoing',
      vacancies: 16,
      registeredCount: 188,
      interviewCount: 61,
      offerCount: 7,
      targetApplications: 170,
      website: `https://www.${context.companyDomain}`,
      contactPerson: 'Engineering Recruiting Manager',
      contactEmail: hiringEmail,
      contactPhone: '+91 91234 56789',
      notes: [
        'Backend role shortlist is ahead of plan.',
        'Cloud role needs more candidate communication before final panel.',
      ],
      hiringSignals: ['API design strength', 'System-thinking', 'DevOps familiarity'],
      rounds: [
        {
          id: 'pe-r1',
          name: 'Aptitude + Coding Assessment',
          date: '2026-04-04',
          mode: 'On Campus',
          owner: 'Assessment Team',
          description: 'Timed aptitude and coding evaluation.',
          completed: true,
        },
        {
          id: 'pe-r2',
          name: 'Technical Panel',
          date: '2026-04-08',
          mode: 'On Campus',
          owner: 'Platform Engineering',
          description: 'Backend, cloud, and reliability depth checks.',
          completed: true,
        },
        {
          id: 'pe-r3',
          name: 'Offer Review',
          date: '2026-04-11',
          mode: 'Virtual',
          owner: 'Hiring Committee',
          description: 'Final calibration and offer release.',
          completed: false,
        },
      ],
      roles: [
        {
          id: 'pe-role-1',
          title: 'Backend Engineer',
          team: 'Core Platform',
          openings: 7,
          targetApplications: 78,
          applications: 74,
          shortlisted: 23,
          interviews: 19,
          offers: 4,
          averagePackageLpa: 10.5,
          packageRange: 'INR 9-13 LPA',
          workMode: 'On Campus',
          hiringManager: 'Harsh Vardhan',
          skills: ['Java', 'Spring Boot', 'SQL', 'APIs'],
          responsibilities: [
            'Build service APIs for company hiring workflows.',
            'Improve data reliability and backend observability.',
            'Support releases across student and recruiter modules.',
          ],
        },
        {
          id: 'pe-role-2',
          title: 'Cloud Operations Analyst',
          team: 'Cloud Platform',
          openings: 5,
          targetApplications: 48,
          applications: 52,
          shortlisted: 14,
          interviews: 11,
          offers: 2,
          averagePackageLpa: 8.2,
          packageRange: 'INR 7-9.5 LPA',
          workMode: 'On Campus',
          hiringManager: 'Vishal Menon',
          skills: ['AWS', 'Linux', 'Monitoring', 'CI/CD'],
          responsibilities: [
            'Monitor deployments and release health.',
            'Support incident response and cloud operations.',
            'Track infrastructure optimization opportunities.',
          ],
        },
        {
          id: 'pe-role-3',
          title: 'Site Reliability Trainee',
          team: 'Reliability',
          openings: 4,
          targetApplications: 44,
          applications: 62,
          shortlisted: 18,
          interviews: 12,
          offers: 1,
          averagePackageLpa: 7.4,
          packageRange: 'INR 6.5-8.5 LPA',
          workMode: 'On Campus',
          hiringManager: 'Kiran Bhat',
          skills: ['Python', 'Observability', 'Automation', 'Troubleshooting'],
          responsibilities: [
            'Automate reliability checks for production workloads.',
            'Support SLO reporting and release audits.',
            'Coordinate issue triage with engineering squads.',
          ],
        },
      ],
    },
    {
      id: 3,
      driveCode: 'DA-MAR-26',
      driveName: 'Data and Automation Drive',
      driveType: 'virtual',
      companyName: context.companyName,
      companyBadge: context.companyBadge,
      driveDate: '2026-03-22',
      driveTime: '11:00 AM',
      venue: 'Virtual - Teams',
      eligibleBranches: ['Computer Science', 'Information Technology', 'Data Science'],
      minCGPA: 6.8,
      passingYears: [2026],
      registrationDeadline: '2026-03-18',
      description: 'Completed hiring drive for data, reporting, and automation roles aligned to internal operations and delivery teams.',
      status: 'completed',
      vacancies: 14,
      registeredCount: 149,
      interviewCount: 46,
      offerCount: 10,
      targetApplications: 140,
      website: `https://www.${context.companyDomain}`,
      contactPerson: 'Data Programs Lead',
      contactEmail: careersEmail,
      contactPhone: '+91 90123 45678',
      notes: [
        'Automation role closed successfully with full intake.',
        'Data analyst joiners to be handed off to business ops.',
      ],
      hiringSignals: ['SQL proficiency', 'Dashboard ownership', 'Automation mindset'],
      rounds: [
        {
          id: 'da-r1',
          name: 'Assessment',
          date: '2026-03-19',
          mode: 'Virtual',
          owner: 'Campus Ops',
          description: 'Online aptitude and data exercise.',
          completed: true,
        },
        {
          id: 'da-r2',
          name: 'Functional Interview',
          date: '2026-03-22',
          mode: 'Virtual',
          owner: 'Data and Automation',
          description: 'Role fit and case discussion.',
          completed: true,
        },
        {
          id: 'da-r3',
          name: 'Offer Rollout',
          date: '2026-03-25',
          mode: 'Virtual',
          owner: 'Recruiting',
          description: 'Offer release and joining coordination.',
          completed: true,
        },
      ],
      roles: [
        {
          id: 'da-role-1',
          title: 'Data Analyst',
          team: 'Business Insights',
          openings: 6,
          targetApplications: 58,
          applications: 61,
          shortlisted: 18,
          interviews: 13,
          offers: 5,
          averagePackageLpa: 7.6,
          packageRange: 'INR 6.5-8.5 LPA',
          workMode: 'Virtual',
          hiringManager: 'Priya Nair',
          skills: ['SQL', 'Power BI', 'Excel', 'Reporting'],
          responsibilities: [
            'Create hiring and operations dashboards.',
            'Support reporting for recruiting teams.',
            'Interpret applicant funnel data for stakeholders.',
          ],
        },
        {
          id: 'da-role-2',
          title: 'QA Automation Engineer',
          team: 'Automation',
          openings: 5,
          targetApplications: 46,
          applications: 49,
          shortlisted: 16,
          interviews: 11,
          offers: 4,
          averagePackageLpa: 8.4,
          packageRange: 'INR 7-9.5 LPA',
          workMode: 'Virtual',
          hiringManager: 'Saurabh Jain',
          skills: ['Selenium', 'Java', 'API Testing', 'CI'],
          responsibilities: [
            'Extend automated test suites for platform releases.',
            'Improve regression velocity before deployments.',
            'Maintain defect and release quality dashboards.',
          ],
        },
        {
          id: 'da-role-3',
          title: 'Reporting Operations Associate',
          team: 'Operations',
          openings: 3,
          targetApplications: 36,
          applications: 39,
          shortlisted: 12,
          interviews: 9,
          offers: 1,
          averagePackageLpa: 6.2,
          packageRange: 'INR 5.5-7 LPA',
          workMode: 'Virtual',
          hiringManager: 'Manasa Reddy',
          skills: ['Excel', 'Operations', 'Coordination', 'Documentation'],
          responsibilities: [
            'Coordinate reporting requests and delivery schedules.',
            'Maintain candidate movement trackers.',
            'Support offer and onboarding communication.',
          ],
        },
      ],
    },
  ];
}

export function getCompanyAnalyticsActivities(): CompanyAnalyticsActivity[] {
  return [
    {
      id: 1,
      candidateName: 'Aarav Mehta',
      roleTitle: 'Backend Engineer',
      driveCode: 'PE-APR-26',
      branch: 'Computer Science',
      stage: 'Final panel scheduled',
      updatedOn: '2026-04-07',
    },
    {
      id: 2,
      candidateName: 'Riya Sharma',
      roleTitle: 'Frontend Engineer',
      driveCode: 'DX-APR-26',
      branch: 'Information Technology',
      stage: 'Portfolio shortlisted',
      updatedOn: '2026-04-06',
    },
    {
      id: 3,
      candidateName: 'Karthik Raman',
      roleTitle: 'Data Analyst',
      driveCode: 'DA-MAR-26',
      branch: 'Data Science',
      stage: 'Offer accepted',
      updatedOn: '2026-03-27',
    },
    {
      id: 4,
      candidateName: 'Sneha Iyer',
      roleTitle: 'Cloud Operations Analyst',
      driveCode: 'PE-APR-26',
      branch: 'Electronics & Communication',
      stage: 'Technical cleared',
      updatedOn: '2026-04-05',
    },
  ];
}

export function getCompanyAnalyticsAlerts(companyName: string): CompanyAnalyticsAlert[] {
  return [
    {
      id: 1,
      type: 'success',
      message: `${companyName} filled 10 offers in the latest data and automation drive.`,
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'info',
      message: 'Frontend Engineering shortlist is ready for manager review.',
      time: '5 hours ago',
    },
    {
      id: 3,
      type: 'warning',
      message: 'Digital Experience drive registration closes in 4 days.',
      time: '1 day ago',
    },
  ];
}
