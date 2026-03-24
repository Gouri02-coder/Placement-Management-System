import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let FooterComponent = class FooterComponent {
    currentYear = new Date().getFullYear();
};
FooterComponent = __decorate([
    Component({
        selector: 'app-footer',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './footer.component.html',
        styleUrls: ['./footer.component.css']
    })
], FooterComponent);
export { FooterComponent };
