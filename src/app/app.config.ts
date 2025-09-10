import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from './environments/environments';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ animações

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // HttpClient
    importProvidersFrom(HttpClientModule),

    // ✅ animações
    provideAnimations(),

    // Service Worker
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production && !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ]
};
