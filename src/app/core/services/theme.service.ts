import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkModeKey = 'darkMode';

  constructor() {
    // Aplica o tema salvo no carregamento
    const enabled = this.isDarkMode();
    document.body.classList.toggle('dark-mode', enabled);
  }

  isDarkMode(): boolean {
    return localStorage.getItem(this.darkModeKey) === 'true';
  }

  setDarkMode(enabled: boolean) {
    localStorage.setItem(this.darkModeKey, String(enabled));
    document.body.classList.toggle('dark-mode', enabled);
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode());
  }
}
