/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import {registerLicense} from '@syncfusion/ej2-base';
import { environment } from './environments/environment';

registerLicense(environment.synfusionLicenseKey)

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
