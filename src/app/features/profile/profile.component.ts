import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { ThemeService } from '../../core/services/theme.service';

interface UserProfile {
  user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
    active: boolean;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent],
  template: `
<div class="dashboard-layout">
  <app-sidebar></app-sidebar>

  <div class="main-content">
    <app-navbar></app-navbar>

    <div class="content">
      <ng-container *ngIf="loading; else profileTemplate">
        <div class="skeleton-profile">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-lines">
            <div class="line short"></div>
            <div class="line medium"></div>
            <div class="line long"></div>
          </div>
        </div>
      </ng-container>

      <ng-template #profileTemplate>
        <div class="profile-card" [ngClass]="{'dark-mode': theme.isDarkMode()}" *ngIf="user">
          <div class="profile-header">
            <img src="assets/images/mock-profile.png" alt="Perfil" class="profile-avatar">
            <div class="profile-info">
              <h2>{{ user.username }}</h2>
              <p class="user-role">{{ user.roles.join(', ') }}</p>
              <p class="user-status" [ngClass]="{'active': user.active, 'inactive': !user.active}">
                {{ user.active ? 'Ativo' : 'Inativo' }}
              </p>
            </div>
          </div>

          <div class="profile-details">
            <div class="detail-item">
              <span class="label">ID:</span>
              <span class="value">{{ user.id }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Roles:</span>
              <span class="value">{{ user.roles.join(', ') }}</span>
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
  background-color: #f5f5f5;
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
  display: flex;
  justify-content: center;
}

.profile-card {
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  padding: 2rem;
}

.profile-card.dark-mode {
  background: #2c2f48;
  color: #fff;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h2 {
  margin: 0;
  font-size: 1.5rem;
}

.user-role {
  color: #888;
  margin: 0.2rem 0;
}

.user-status.active {
  color: green;
}

.user-status.inactive {
  color: red;
}

.profile-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item .label {
  font-weight: bold;
}

.skeleton-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ddd;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-lines .line {
  height: 16px;
  border-radius: 8px;
  background: #ddd;
}

.skeleton-lines .line.short { width: 30%; }
.skeleton-lines .line.medium { width: 50%; }
.skeleton-lines .line.long { width: 70%; }

@media (max-width: 767.98px) {
  .main-content { margin-left: 0; width: 100%; }
  .profile-card { padding: 1rem; }
  .profile-details { grid-template-columns: 1fr; }
}
  `]
})
export class ProfileComponent implements OnInit {
  user?: UserProfile['user'];
  loading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public theme: ThemeService
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado!');
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<UserProfile>('http://localhost:5000/api/auth/profile', { headers })
      .subscribe({
        next: res => {
          this.user = res.user;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Erro ao carregar perfil', err);
          this.loading = false;
        }
      });
  }
}
