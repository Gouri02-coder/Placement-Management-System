<<<<<<< HEAD
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app';
import { routes as Routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; 

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(Routes)),
    provideHttpClient(),
  ],
}).catch(err => console.error(err));
=======
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
>>>>>>> 53b036966c30718bb2f8410656ebe2d0f4e00ad4
