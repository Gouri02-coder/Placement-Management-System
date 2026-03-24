import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// Import standalone components
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
// Services
import { StudentService } from './services/student.service';
import { JobService } from './services/job.service';
import { ApplicationService } from './services/application.service';
import { InterviewService } from './services/interview.service';
import { StudentRoutingModule } from './student.routes';
let StudentModule = class StudentModule {
};
StudentModule = __decorate([
    NgModule({
        declarations: [], // Empty since we're using standalone components
        imports: [
            CommonModule,
            ReactiveFormsModule,
            FormsModule,
            RouterModule,
            // Angular Material
            MatCardModule,
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule,
            MatSelectModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatChipsModule,
            MatIconModule,
            MatProgressSpinnerModule,
            MatTabsModule,
            MatDialogModule,
            MatSnackBarModule,
            // Import standalone components
            StudentDashboardComponent,
            StudentProfileComponent,
            JobSearchComponent,
            MyApplicationsComponent,
            ApplicationStatusComponent,
            ApplyJobComponent,
            InterviewScheduleComponent,
            InterviewPreparationComponent,
            InterviewFeedbackComponent,
            ResumeBuilderComponent,
            PlacementDrivesComponent,
            StudentRoutingModule
        ],
        providers: [
            StudentService,
            JobService,
            ApplicationService,
            InterviewService
        ]
    })
], StudentModule);
export { StudentModule };
