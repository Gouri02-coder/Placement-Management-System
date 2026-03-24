import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
let LandingPageComponent = class LandingPageComponent {
    router;
    constructor(router) {
        this.router = router;
    }
    ngOnInit() {
        this.initializeAnimations();
    }
    initializeAnimations() {
        // Animation logic
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.card, section').forEach((el) => {
            observer.observe(el);
        });
    }
    navigateToLogin() {
        this.router.navigate(['/login']);
    }
    navigateToRegister() {
        this.router.navigate(['/register']);
    }
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
};
LandingPageComponent = __decorate([
    Component({
        selector: 'app-landing-page',
        standalone: true,
        imports: [CommonModule, RouterLink,],
        templateUrl: './landing-page.html',
        styleUrls: ['./landing-page.css']
    })
], LandingPageComponent);
export { LandingPageComponent };
