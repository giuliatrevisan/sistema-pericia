import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { ThemeService } from '../../core/services/theme.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserEditDialogComponent } from '../users/table/components/dialogs/user-edit-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface UserProfile {
  user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
    active: boolean;
    avatarUrl?: string;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, SidebarComponent, NavbarComponent,
    MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule
  ],
  template: `
<div class="dashboard-layout d-flex min-vh-100">
  <app-sidebar></app-sidebar>

  <div class="main-content flex-grow-1">
    <app-navbar class="sticky-top bg-light shadow-sm"></app-navbar>

    <div class="content p-3 d-flex justify-content-center">
      <ng-container *ngIf="loading; else profileTemplate">
        <mat-spinner></mat-spinner>
      </ng-container>

      <ng-template #profileTemplate>
        <div class="profile-wrapper w-100 d-flex flex-column align-items-center">
          <!-- Header -->
          <div class="header mb-4 text-center" [ngClass]="theme.isDarkMode() ? 'header-dark' : 'header-light'">
            <h2>Seu Perfil</h2>
            <p class="subtitle">Visualize e edite suas informações pessoais e avatar.</p>
          </div>

          <div class="profile-card p-4 shadow rounded" [ngClass]="theme.isDarkMode() ? 'dark' : 'light'" *ngIf="user">
            
            <!-- AVATAR -->
            <div class="avatar-wrapper mx-auto mb-3 position-relative">
              <img [src]="user.avatarUrl || 'assets/illustrations/perfil.jpg'" alt="Perfil" class="profile-avatar rounded-circle">
              <input type="file" accept="image/*" (change)="onFileSelected($event)" hidden #fileInput>
              <button mat-icon-button class="change-avatar-btn position-absolute bottom-0 end-0" (click)="fileInput.click()">
                <mat-icon>camera_alt</mat-icon>
              </button>
            </div>

            <!-- INFORMAÇÕES -->
            <div class="profile-details text-center">
              <div class="detail-item mb-2"><span class="label fw-bold">ID:</span> {{ user.id }}</div>
              <div class="detail-item mb-2"><span class="label fw-bold">Email:</span> {{ user.email }}</div>
              <div class="detail-item mb-2"><span class="label fw-bold">Roles:</span> {{ user.roles.join(', ') }}</div>
              <div class="detail-item mb-3">
                <span class="label fw-bold">Status:</span> 
                <span [ngClass]="{'active': user.active, 'inactive': !user.active}">
                  {{ user.active ? 'Ativo' : 'Inativo' }}
                </span>
              </div>

              <!-- BOTÃO EDITAR -->
              <button class="btn btn-success mt-2 w-100" (click)="abrirEditarModal()">
                Editar
              </button>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  </div>
</div>
  `,
  styles: [`
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background-color: transparent;
}

.main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  margin-top: 60px;
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

/* Header padrão como UrgenciaComponent */
.header {
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  text-align: center;
  margin-bottom: 2rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.header-light { background-color: rgba(255, 255, 255, 0.8); color: #333; }
.header-dark { background-color: #2c2c2c; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }

.header .subtitle {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: inherit;
}

/* Profile Card */
.profile-wrapper { width: 100%; max-width: 450px; }
.profile-card {
  width: 100%;
  border-radius: 12px;
  padding: 1.5rem;
  transition: background-color 0.3s, color 0.3s;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.profile-card.light { background-color: #fff; color: #000; }
.profile-card.dark { background-color: #2c2f48; color: #fff; }

.avatar-wrapper { width: 100px; height: 100px; position: relative; }
.profile-avatar { width: 100%; height: 100%; object-fit: cover; }
.change-avatar-btn { background-color: white; border-radius: 50%; border: 1px solid #ccc; }

.profile-details .active { color: green; }
.profile-details .inactive { color: red; }

@media (max-width: 767.98px) {
  .main-content { margin-left: 0; width: 100%; }
  .profile-wrapper { max-width: 350px; }
  .profile-card { padding: 1rem; }
}
  `]
})
export class ProfileComponent implements OnInit {
  user?: UserProfile['user'];
  loading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public theme: ThemeService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { this.fetchProfile(); }

  fetchProfile() {
    const token = localStorage.getItem('token');
    if (!token) { this.loading = false; return; }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<UserProfile>('http://localhost:5000/api/auth/profile', { headers })
      .subscribe({
        next: res => { this.user = res.user; this.loading = false; this.cdr.detectChanges(); },
        error: err => { console.error(err); this.loading = false; }
      });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (this.user) this.user.avatarUrl = reader.result as string; this.cdr.detectChanges(); };
    reader.readAsDataURL(file);
  }

  abrirEditarModal() {
    if (!this.user) return;
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '450px',
      data: { ...this.user }
    });

    dialogRef.afterClosed().subscribe((atualizado: boolean) => {
      if (atualizado) alert('Usuário atualizado (simulado)');
    });
  }
}
