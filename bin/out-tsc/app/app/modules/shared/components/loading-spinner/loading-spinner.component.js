import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
let LoadingSpinnerComponent = class LoadingSpinnerComponent {
    size = 'medium';
    message = 'Loading...';
    type = 'spinner';
};
__decorate([
    Input()
], LoadingSpinnerComponent.prototype, "size", void 0);
__decorate([
    Input()
], LoadingSpinnerComponent.prototype, "message", void 0);
__decorate([
    Input()
], LoadingSpinnerComponent.prototype, "type", void 0);
LoadingSpinnerComponent = __decorate([
    Component({
        selector: 'app-loading-spinner',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './loading-spinner.component.html',
        styleUrls: ['./loading-spinner.component.css']
    })
], LoadingSpinnerComponent);
export { LoadingSpinnerComponent };
