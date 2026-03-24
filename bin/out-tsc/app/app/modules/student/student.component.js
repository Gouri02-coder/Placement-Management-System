import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
let StudentComponent = class StudentComponent {
    authService;
    studentService;
    router;
    student = null;
    constructor(authService, studentService, router) {
        this.authService = authService;
        this.studentService = studentService;
        this.router = router;
    }
    ngOnInit() {
        const user = this.authService.currentUserValue;
        if (user && user.id) {
            this.studentService.getStudentProfile(user.id.toString()).subscribe({
                next: (data) => (this.student = data),
                error: (err) => console.error('Layout profile load failed', err)
            });
        }
    }
    onLogout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
};
StudentComponent = __decorate([
    Component({
        selector: 'app-student',
        standalone: true,
        imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
        templateUrl: './student.component.html',
        styleUrls: ['./student.component.css']
    })
], StudentComponent);
export { StudentComponent };
