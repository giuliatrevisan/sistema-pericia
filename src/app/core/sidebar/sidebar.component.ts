import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { sidebarMobileOpen } from './sidebar.store';
import { AuthService } from '../interceptors/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div 
      class="sidebar position-fixed h-100 p-3"
      [class.sidebar-open]="isMobile ? sidebarMobileOpen() : true"
      [class.d-none]="isMobile && !sidebarMobileOpen()">

      <h4 class="mb-4 text-white">Menu</h4>

      <ul class="nav flex-column mb-3">
        <li class="nav-item mb-2"><a class="nav-link text-white" routerLink="/dashboard">Dashboard</a></li>
        <li class="nav-item mb-2"><a class="nav-link text-white" routerLink="/solicitacoes">Solicitações</a></li>
        <li class="nav-item mb-2"><a class="nav-link text-white" routerLink="/usuarios">Usuários</a></li>
      </ul>

      <hr class="text-secondary" />

      <!-- Botões Dark/Light e Logout -->
      <div class="d-flex flex-column gap-2 mt-3">
        <button class="btn btn-outline-light btn-sm" (click)="toggleDarkMode()">
          {{ theme.isDarkMode() ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <button class="btn btn-light btn-sm" (click)="logout()">Logout</button>
      </div>

    </div>

    <!-- Overlay mobile -->
    <div class="overlay" *ngIf="isMobile && sidebarMobileOpen()" (click)="toggleSidebar()"></div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      top: 0;
      left: 0;
      background-color: var(--sidebar-color);
      transition: transform 0.3s ease;
      z-index: 1050;
    }

    @media (min-width:768px) { 
      .sidebar { 
        transform: translateX(0) !important; 
        box-shadow: none !important;
      } 
    }

    @media (max-width:767.98px) { 
      .sidebar { 
        transform: translateX(-100%); 
        box-shadow: none; 
      } 
      .sidebar.sidebar-open { 
        transform: translateX(0); 
        box-shadow: 4px 0 8px rgba(0, 0, 0, 0.3); 
      } 
    }

    .overlay { 
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
      background-color: rgba(0,0,0,0.5); z-index: 1040; transition: opacity 0.3s ease; 
    }
  `]
})
export class SidebarComponent {
  sidebarMobileOpen = sidebarMobileOpen;

  constructor(
    private auth: AuthService, 
    private router: Router,
    public theme: ThemeService   // <-- aqui injeta o ThemeService
  ) {}

  get isMobile() {
    return window.innerWidth < 768;
  }

  toggleSidebar() {
    sidebarMobileOpen.set(!sidebarMobileOpen());
  }

  toggleDarkMode() {
    this.theme.toggleDarkMode();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.isMobile) sidebarMobileOpen.set(false);
  }
}
