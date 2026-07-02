import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiUrlService {

  getBaseUrl(): string {
    if (Capacitor.getPlatform() === 'android') {
      return environment.androidEmulatorApiBaseUrl;
    }

    return environment.webApiBaseUrl;
  }
}
