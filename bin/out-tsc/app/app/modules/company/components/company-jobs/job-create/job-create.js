import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
let JobCreateComponent = class JobCreateComponent {
    fb;
    router;
    jobService;
    jobForm;
    isSubmitting = false;
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
    commonSkills = [
        'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Node.js',
        'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning',
        'Data Analysis', 'UI/UX Design', 'Project Management', 'Agile Methodology'
    ];
    constructor(fb, router, jobService) {
        this.fb = fb;
        this.router = router;
        this.jobService = jobService;
        this.jobForm = this.createForm();
    }
    ngOnInit() { }
    createForm() {
        return this.fb.group({
            title: ['', [Validators.required, Validators.minLength(5)]],
            description: ['', [Validators.required, Validators.minLength(100)]],
            type: ['fulltime', [Validators.required]],
            location: ['onsite', [Validators.required]],
            category: ['', [Validators.required]],
            // Salary/Stipend
            compensationType: ['salary'],
            salary: this.fb.group({
                min: [null],
                max: [null],
                currency: ['INR']
            }),
            stipend: [null],
            // Eligibility
            eligibility: this.fb.group({
                branches: [[], [Validators.required]],
                minCGPA: [null, [Validators.min(0), Validators.max(10)]],
                yearOfPassing: [[new Date().getFullYear()], [Validators.required]],
                requiredSkills: [[], [Validators.required]],
                additionalRequirements: ['']
            }),
            applicationDeadline: ['', [Validators.required]],
            status: ['draft']
        });
    }
    get branchesArray() {
        return this.jobForm.get('eligibility.branches');
    }
    get skillsArray() {
        return this.jobForm.get('eligibility.requiredSkills');
    }
    get compensationType() {
        return this.jobForm.get('compensationType')?.value;
    }
    toggleBranch(branch) {
        const branches = this.jobForm.get('eligibility.branches')?.value;
        const index = branches.indexOf(branch);
        if (index > -1) {
            branches.splice(index, 1);
        }
        else {
            branches.push(branch);
        }
        this.jobForm.get('eligibility.branches')?.setValue([...branches]);
    }
    toggleSkill(skill) {
        const skills = this.jobForm.get('eligibility.requiredSkills')?.value;
        const index = skills.indexOf(skill);
        if (index > -1) {
            skills.splice(index, 1);
        }
        else {
            skills.push(skill);
        }
        this.jobForm.get('eligibility.requiredSkills')?.setValue([...skills]);
    }
    addCustomSkill(event) {
        const skill = event.target.value.trim();
        if (skill && !this.commonSkills.includes(skill)) {
            this.commonSkills.push(skill);
            this.toggleSkill(skill);
            event.target.value = '';
        }
    }
    onCompensationTypeChange() {
        if (this.compensationType === 'salary') {
            this.jobForm.get('stipend')?.setValue(null);
        }
        else {
            this.jobForm.get('salary')?.patchValue({ min: null, max: null });
        }
    }
    onSubmit() {
        if (this.jobForm.valid) {
            this.isSubmitting = true;
            const formValue = this.jobForm.value;
            const jobData = {
                title: formValue.title,
                description: formValue.description,
                type: formValue.type,
                location: formValue.location,
                salary: formValue.compensationType === 'salary' && formValue.salary.min ? {
                    min: formValue.salary.min,
                    max: formValue.salary.max,
                    currency: formValue.salary.currency
                } : undefined,
                stipend: formValue.compensationType === 'stipend' ? formValue.stipend : undefined,
                eligibility: {
                    branches: formValue.eligibility.branches,
                    minCGPA: formValue.eligibility.minCGPA,
                    yearOfPassing: formValue.eligibility.yearOfPassing,
                    requiredSkills: formValue.eligibility.requiredSkills,
                    additionalRequirements: formValue.eligibility.additionalRequirements
                },
                applicationDeadline: new Date(formValue.applicationDeadline)
            };
            this.jobService.createJob(jobData).subscribe({
                next: (createdJob) => {
                    this.isSubmitting = false;
                    alert('Job created successfully!');
                    if (formValue.status === 'active') {
                        this.router.navigate(['/company/jobs']);
                    }
                    else {
                        this.router.navigate(['/company/jobs'], { queryParams: { draft: true } });
                    }
                },
                error: (error) => {
                    console.error('Error creating job:', error);
                    this.isSubmitting = false;
                    alert('Error creating job. Please try again.');
                }
            });
        }
        else {
            this.markFormGroupTouched(this.jobForm);
        }
    }
    saveAsDraft() {
        this.jobForm.patchValue({ status: 'draft' });
        this.onSubmit();
    }
    publishJob() {
        this.jobForm.patchValue({ status: 'active' });
        this.onSubmit();
    }
    markFormGroupTouched(formGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
            else {
                control?.markAsTouched();
            }
        });
    }
    cancel() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            this.router.navigate(['/company/jobs']);
        }
    }
    // Form field getters
    get title() { return this.jobForm.get('title'); }
    get description() { return this.jobForm.get('description'); }
    get type() { return this.jobForm.get('type'); }
    get location() { return this.jobForm.get('location'); }
    get category() { return this.jobForm.get('category'); }
    get applicationDeadline() { return this.jobForm.get('applicationDeadline'); }
    get minCGPA() { return this.jobForm.get('eligibility.minCGPA'); }
    get requiredSkills() { return this.jobForm.get('eligibility.requiredSkills'); }
    get selectedBranches() { return this.jobForm.get('eligibility.branches')?.value; }
    get selectedSkills() { return this.jobForm.get('eligibility.requiredSkills')?.value; }
    get minDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    get maxDate() {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return nextYear.toISOString().split('T')[0];
    }
};
JobCreateComponent = __decorate([
    Component({
        selector: 'app-job-create',
        imports: [CommonModule, ReactiveFormsModule, FormsModule],
        templateUrl: './job-create.html',
        styleUrls: ['./job-create.css']
    })
], JobCreateComponent);
export { JobCreateComponent };
