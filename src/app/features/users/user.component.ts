import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { UsersTableComponent } from './table/components/users-table.component';
import { UsersChartsComponent } from './charts/user-charts-component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environments';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    UsersTableComponent,
    UsersChartsComponent,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  template: `
  <div class="dashboard-layout d-flex min-vh-100"
       [ngStyle]="{'background-image': theme.isDarkMode() ? 'url(/assets/images/backgrounds/bg-dark.jpg)' : 'url(/assets/images/backgrounds/bg-light.jpg)'}">
    
    <app-sidebar></app-sidebar>
  
    <div class="main-content flex-grow-1">
      <app-navbar class="sticky-top bg-light shadow-sm"></app-navbar>
  
      <div class="content p-3">
        <!-- Loading -->
        <ng-container *ngIf="loading">
          <div class="d-flex justify-content-center align-items-center" style="height:200px">
            <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
          </div>
        </ng-container>
  
        <!-- Error -->
        <ng-container *ngIf="!loading && hasError">
          <div class="alert alert-danger text-center" role="alert">
            Erro ao carregar usuários. Tente novamente mais tarde.
          </div>
        </ng-container>
  
        <!-- Empty -->
        <ng-container *ngIf="!loading && !hasError && users.length === 0">
          <div class="alert alert-info text-center" role="alert">
            Nenhum usuário encontrado.
          </div>
        </ng-container>
  
        <!-- Conteúdo -->
        <ng-container *ngIf="!loading && !hasError && users.length > 0">
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <app-users-charts [users]="users"></app-users-charts>
            </div>
            <div class="col-12 col-md-8">
              <app-users-table [users]="users"></app-users-table>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .dashboard-layout {
    width: 100%;
    min-height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background 0.3s ease;
  }
  
  /* Conteúdo rolável */
  .main-content { margin-left: 250px; }
  @media (max-width:767.98px) { .main-content { margin-left:0; } }
  .content { margin-top: 60px; overflow-y: auto; min-height: calc(100vh - 60px); }
  `]
  
  
})
export class UsersComponent implements OnInit {
  loading = true;
  hasError = false;
  users: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public theme: ThemeService // << adiciona isso
  ) {}
  
  ngOnInit() {
    this.carregarUsers();
  }

  carregarUsers() {
    this.loading = true;
    this.hasError = false;

    const token = localStorage.getItem('token');
    if (!token) {
      this.hasError = true;
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any>(`${environment.apiUrl}/admin/users`, { headers }).subscribe(
      res => {
        this.users = res.users || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      err => {
        console.error('Erro ao carregar usuários', err);
        this.hasError = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }
}
