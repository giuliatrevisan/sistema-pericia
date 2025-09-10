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
import 'bootstrap/dist/css/bootstrap.min.css';

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
<div class="dashboard-layout">
  <app-sidebar></app-sidebar>

  <div class="main-content">
    <app-navbar></app-navbar>

    <div class="content d-flex justify-content-center align-items-center">
      <ng-container *ngIf="loading; else profileTemplate">
        <mat-spinner></mat-spinner>
      </ng-container>

      <ng-template #profileTemplate>
        <div class="profile-card p-4 shadow rounded" [ngClass]="theme.isDarkMode() ? 'dark' : 'light'" *ngIf="user">
          
          <h2 class="profile-title mb-3">Seu Perfil</h2>

          <!-- AVATAR -->
          <div class="avatar-wrapper mx-auto mb-3 position-relative">
            <img [src]="user.avatarUrl || 'assets/illustrations/perfil.jpg'" alt="Perfil" class="profile-avatar rounded-circle">
            <input type="file" accept="image/*" (change)="onFileSelected($event)" hidden #fileInput>
            <button mat-icon-button class="change-avatar-btn position-absolute bottom-0 end-0" (click)="fileInput.click()">
              <mat-icon>camera_alt</mat-icon>
            </button>
          </div>

          <!-- INFORMAÇÕES -->
          <div class="profile-details">
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

.profile-card {
  width: 100%;
  max-width: 400px;
  height: 430px;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.profile-card.light {
  background-color: #fff;
  color: #000;
}

.profile-card.dark {
  background-color: #2c2f48;
  color: #fff;
}

.profile-title {
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-avatar-btn {
  background-color: white;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.profile-details .active {
  color: green;
}

.profile-details .inactive {
  color: red;
}

@media (max-width: 767.98px) {
  .main-content { margin-left: 0; width: 100%; }
  .profile-card { padding: 1rem; max-width: 300px; }
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
      data: {
        id: this.user.id,
        username: this.user.username,
        email: this.user.email,
        roles: this.user.roles,
        active: this.user.active
      }
    });

    dialogRef.afterClosed().subscribe((atualizado: boolean) => {
      if (atualizado) alert('Usuário atualizado (simulado)');
    });
  }
}
