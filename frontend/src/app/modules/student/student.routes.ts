import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { JobSearchComponent } from './components/job/job-search/job-search.component';
import { MyApplicationsComponent } from './components/applications/my-applications/my-applications.component';
import { ApplicationStatusComponent } from './components/applications/application-status/application-status.component';
import { ApplyJobComponent } from './components/applications/apply-job/apply-job.component';
import { InterviewScheduleComponent } from './components/interviews/interview-schedule/interview-schedule.component';
import { InterviewPreparationComponent } from './components/interviews/interview-preparation/interview-preparation.component';
import { InterviewFeedbackComponent } from './components/interviews/interview-feedback/interview-feedback.component';
import { ResumeBuilderComponent } from './components/resume-builder/resume-builder.component';
import { PlacementDrivesComponent } from './components/placement-drives/placement-drives.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: StudentDashboardComponent,
    data: { title: 'Student Dashboard' }
  },
  {
    path: 'profile',
    component: StudentProfileComponent,
    data: { title: 'Student Profile' }
  },
  {
    path: 'job-search',
    component: JobSearchComponent,
    data: { title: 'Job Search' }
  },
  {
    path: 'applications',
    children: [
      {
        path: '',
        component: MyApplicationsComponent,
        data: { title: 'My Applications' }
      },
      {
        path: 'status/:id',
        component: ApplicationStatusComponent,
        data: { title: 'Application Status' }
      },
      {
        path: 'apply/:jobId',
        component: ApplyJobComponent,
        data: { title: 'Apply for Job' }
      }
    ]
  },
  {
    path: 'interviews',
    children: [
      {
        path: '',
        component: InterviewScheduleComponent,
        data: { title: 'Interview Schedule' }
      },
      {
        path: 'preparation',
        component: InterviewPreparationComponent,
        data: { title: 'Interview Preparation' }
      },
      {
        path: 'feedback/:id',
        component: InterviewFeedbackComponent,
        data: { title: 'Interview Feedback' }
      }
    ]
  },
  {
    path: 'resume-builder',
    component: ResumeBuilderComponent,
    data: { title: 'Resume Builder' }
  },
  {
    path: 'placement-drives',
    component: PlacementDrivesComponent,
    data: { title: 'Placement Drives' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(STUDENT_ROUTES)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }