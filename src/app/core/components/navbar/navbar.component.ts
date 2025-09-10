import { Component, OnInit, OnDestroy } from '@angular/core';
import { sidebarMobileOpen } from '../sidebar/sidebar.store';
import { Router } from '@angular/router';
import { AuthService } from '../../interceptors/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
<nav class="navbar fixed-top px-3 navbar-flex"
     [ngStyle]="{
       'background': theme.isDarkMode() ? 'linear-gradient(to bottom, #3a3f70, #313866)' : '#f8f9fa',
       'color': theme.isDarkMode() ? '#fff' : '#000',
       'box-shadow': theme.isDarkMode() ? '0 6px 10px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.15)',
       'border-bottom': theme.isDarkMode() ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
       'height':'60px', 'z-index':'1030'
     }">

  <!-- Botão Hamburguer -->
  <button class="btn hamburger-btn d-md-none"
          type="button"
          (click)="toggleSidebar()"
          [ngClass]="theme.isDarkMode() ? 'btn-outline-light' : 'btn-outline-dark'">
    <span class="navbar-toggler-icon"
          [style.filter]="theme.isDarkMode() ? 'invert(1)' : 'none'"></span>
  </button>

  <!-- Espaço flexível para empurrar logo + tempo para a direita -->
  <div class="ms-auto d-flex align-items-center time-logo-wrapper">
    <!-- Temporizador -->
    <div class="session-timer"
         [ngStyle]="{ color: theme.isDarkMode() ? '#fff' : '#e91e63' }"
         *ngIf="timeLeft >= 0">
      Sessão expira em: {{ minutes }}:{{ seconds | number:'2.0' }}
    </div>

    <!-- Logo -->
    <a class="navbar-brand ms-2" href="#">
      <img src="assets/images/logos/logo-horizontal.png" height="30" alt="Logo"
           [style.filter]="theme.isDarkMode() ? 'brightness(4)' : 'none'">
    </a>
  </div>

</nav>
  `,
  styles: [`
    .navbar-flex {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .hamburger-btn {
      margin-right: 0.5rem;
    }

    .time-logo-wrapper {
      display: flex;
      align-items: center;
      gap: 0.3rem; /* Mantém tempo e logo próximos */
    }

    .session-timer {
      font-weight: bold;
      font-size: 0.9rem;
    }

    /* Ordem responsiva */
    @media (max-width: 767px) {
      .hamburger-btn { order: 1; }
      .time-logo-wrapper { order: 2; }
    }

    @media (min-width: 768px) {
      .hamburger-btn { display: none; }
      .time-logo-wrapper { order: 1; }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  timeLeft: number = 0; // tempo restante em ms
  minutes: number = 0;
  seconds: number = 0;
  private intervalSub!: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    public theme: ThemeService
  ) { }

  ngOnInit() {
    this.updateTimeLeft();
    this.intervalSub = interval(1000).subscribe(() => this.updateTimeLeft());
  }

  ngOnDestroy() {
    if (this.intervalSub) this.intervalSub.unsubscribe();
  }

  toggleSidebar() {
    sidebarMobileOpen.set(!sidebarMobileOpen());
  }

  private updateTimeLeft() {
    const logoutTimestamp = localStorage.getItem('logout-timestamp');
    if (!logoutTimestamp) {
      this.timeLeft = 0;
      this.minutes = 0;
      this.seconds = 0;
      return;
    }

    const diff = +logoutTimestamp - Date.now();
    this.timeLeft = diff > 0 ? diff : 0;
    this.minutes = Math.floor(this.timeLeft / 1000 / 60);
    this.seconds = Math.floor((this.timeLeft / 1000) % 60);

    if (this.timeLeft === 0 && this.auth.isAuthenticated()) {
      this.auth.logout();
      alert('Sua sessão expirou!');
    }
  }
}
