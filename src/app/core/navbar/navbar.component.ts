import { Component } from '@angular/core';
import { sidebarMobileOpen } from '../sidebar/sidebar.store';
import { Router } from '@angular/router';
import { AuthService } from '../interceptors/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
<nav class="navbar fixed-top d-flex align-items-center px-3"
     [ngStyle]="{
       'background': theme.isDarkMode() ? 'linear-gradient(to bottom, #3a3f70, #313866)' : '#f8f9fa',
       'color': theme.isDarkMode() ? '#fff' : '#000',
       'box-shadow': theme.isDarkMode() ? '0 6px 10px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.15)',
       'border-bottom': theme.isDarkMode() ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)'
     }"
     style="height:60px; z-index:1030;">



  <button class="btn btn-outline-light d-md-none me-2" type="button" (click)="toggleSidebar()">
    <span class="navbar-toggler-icon"></span>
  </button>

  <a class="navbar-brand ms-auto" href="#">
    <img src="assets/images/logos/logo-horizontal.png" height="30" alt="Logo"
         [style.filter]="theme.isDarkMode() ? 'brightness(4)' : 'none'">
  </a>
</nav>
  `
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
    public theme: ThemeService
  ) { }

  toggleSidebar() {
    sidebarMobileOpen.set(!sidebarMobileOpen());
  }
}
