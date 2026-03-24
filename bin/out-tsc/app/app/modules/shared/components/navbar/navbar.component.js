import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let NavbarComponent = class NavbarComponent {
    router;
    constructor(router) {
        this.router = router;
    }
    navigateTo(route) {
        this.router.navigate([route]);
    }
    isLoggedIn() {
        // Add your actual authentication logic here
        return false; // Change based on auth status
    }
    logout() {
        // Add logout logic here
        this.router.navigate(['/']);
    }
};
NavbarComponent = __decorate([
    Component({
        selector: 'app-navbar',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.css']
    })
], NavbarComponent);
export { NavbarComponent };
