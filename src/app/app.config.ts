import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth-interceptor';
import { CustomErrorHandler } from './services/custom-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),

  { provide: ErrorHandler, useClass: CustomErrorHandler },
  provideAnimationsAsync(),
  provideHttpClient(
    withInterceptors([authInterceptor])
  )
  ]
};
