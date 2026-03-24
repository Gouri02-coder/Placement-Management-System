import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
// Pipes & Directives (will be added later)
// import { DateFormatPipe } from './pipes/date-format.pipe';
// import { ClickOutsideDirective } from './directives/click-outside.directive';
const COMPONENTS = [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
];
// const PIPES = [DateFormatPipe];
// const DIRECTIVES = [ClickOutsideDirective];
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    NgModule({
        declarations: [
        // ...COMPONENTS,
        // ...PIPES,
        // ...DIRECTIVES
        ],
        imports: [
            CommonModule,
            RouterModule,
            // Import standalone components
            ...COMPONENTS
        ],
        exports: [
            CommonModule,
            RouterModule,
            ...COMPONENTS
            // ...PIPES,
            // ...DIRECTIVES
        ]
    })
], SharedModule);
export { SharedModule };
