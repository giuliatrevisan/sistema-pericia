import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { sidebarMobileOpen } from './sidebar.store';
import { AuthService } from '../../interceptors/auth.service';
import { ThemeService } from '../../services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LogoutDialogComponent } from '../dialogs/logout-dialog.component';

interface User {
  name: string;
  email: string;
  avatar?: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    LogoutDialogComponent
  ],
  template: `
    <div 
      class="sidebar d-flex flex-column p-3 position-fixed h-100 text-white"
      [@sidebarAnim]="isMobile ? (sidebarMobileOpen() ? 'open' : 'closed') : 'open'">

      <!-- User Info -->
      <div class="text-center mb-4">
        <img 
          [src]="user?.avatar || 'assets/illustrations/perfil.jpg'" 
          class="rounded-circle mb-2 border shadow-sm"
          width="80" height="80"
          alt="Avatar"
          matTooltip="Ir para perfil"
          (click)="goToProfile()"
          style="cursor:pointer; transition: transform .2s"
          (mouseenter)="hoverAvatar=true" (mouseleave)="hoverAvatar=false"
          [style.transform]="hoverAvatar ? 'scale(1.05)' : 'scale(1)'"
        >
        <h6 class="fw-bold mb-0 text-white">{{ getUserRole() }}</h6>
        <small class="d-block text-white">{{ user?.email || 'admin@sistema.com' }}</small>
      </div>

      <hr class="my-3 border-light">

      <!-- Menu -->
      <ul class="nav flex-column mb-4">
        <li class="nav-item mb-2" *ngFor="let item of menuItems">
          <a class="nav-link d-flex align-items-center text-white"
             [routerLink]="item.route"
             (mouseenter)="hoverItem=item.label" (mouseleave)="hoverItem=''"
             [style.backgroundColor]="hoverItem===item.label ? 'rgba(255,255,255,0.1)' : ''">
            <mat-icon class="me-2">{{ item.icon }}</mat-icon> {{ item.label }}
          </a>
        </li>
      </ul>

      <hr class="my-3 border-light">

      <!-- Actions -->
      <div class="mt-auto d-flex flex-column gap-2">
        <button class="btn btn-outline-light btn-sm d-flex align-items-center justify-content-center" (click)="toggleDarkMode()">
          <mat-icon class="me-2">{{ theme.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          {{ theme.isDarkMode() ? 'Light Mode' : 'Dark Mode' }}
        </button>

        <!-- Botão apenas para abrir o modal de logout -->
        <button class="btn btn-danger btn-sm d-flex align-items-center justify-content-center" (click)="openLogoutDialog()">
          <mat-icon class="me-2">logout</mat-icon> Logout
        </button>
      </div>
    </div>

    <!-- Overlay -->
    <div class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
         *ngIf="isMobile && sidebarMobileOpen()"
         (click)="toggleSidebar()"
         [@overlayAnim]>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      max-width: 100vw;
      top: 0;
      left: 0;
      z-index: 2000;
    }
  `],
  animations: [
    trigger('sidebarAnim', [
      state('open', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(-100%)' })),
      transition('open <=> closed', animate('300ms ease-in-out'))
    ]),
    trigger('overlayAnim', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))])
    ])
  ]
})
export class SidebarComponent {
  sidebarMobileOpen = sidebarMobileOpen;
  user: User | null = null;
  hoverAvatar = false;
  hoverItem = '';

  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Relatórios', route: '/relatorios', icon: 'assignment' },
    { label: 'Usuários', route: '/user', icon: 'group', adminOnly: true },
    { label: 'Perfil', route: '/profile', icon: 'account_circle' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    public theme: ThemeService,
    private dialog: MatDialog
  ) {
    this.user = this.auth.getUser();
    this.menuItems = this.menuItems.filter(item => !item.adminOnly || this.isAdmin);
  }

  getUserRole(): string {
    if (!this.user?.roles) return 'Usuário';
    if (this.user.roles.includes('admin')) return 'Administrador';
    if (this.user.roles.includes('perito')) return 'Perito';
    return 'Usuário';
  }

  get isMobile() { return window.innerWidth < 768; }
  get isAdmin(): boolean { return this.user?.roles?.includes('admin') ?? false; }

  toggleSidebar() { sidebarMobileOpen.set(!sidebarMobileOpen()); }
  toggleDarkMode() { this.theme.toggleDarkMode(); }
  goToProfile() { this.router.navigate(['/profile']); }

  // Apenas abre o dialog de logout
  openLogoutDialog() {
    this.dialog.open(LogoutDialogComponent, {
      data: { message: 'Você tem certeza que deseja sair?' }
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.isMobile) sidebarMobileOpen.set(false);
  }
}
