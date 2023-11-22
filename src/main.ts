/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import {registerLicense} from '@syncfusion/ej2-base';

registerLicense('ORg4AjUWIQA/Gnt2VlhhQlJCfV5AQmJKYVF2R2BJflRwfF9GZkwgOX1dQl9gSH9RdEViWnlfd3dXQWk=')

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
