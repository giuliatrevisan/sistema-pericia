import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { SolicitacoesTableComponent } from './components/table/solicitacoes-table.component';
import { DashboardStatsComponent } from './components/stats/dashboard-stats.component';
import { SkeletonCardComponent } from './components/stats/components/skeleton/skeleton-card.component';
import { AuthService } from '../../core/interceptors/auth.service';
import { environment } from '../../environments/environments';
import { ThemeService } from '../../core/services/theme.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    SolicitacoesTableComponent,
    DashboardStatsComponent,
    SkeletonCardComponent
  ],
  template: `
<div class="dashboard-layout d-flex min-vh-100"
     [ngStyle]="{'background-image': theme.isDarkMode() ? 'url(/assets/images/backgrounds/bg-dark.jpg)' : 'url(/assets/images/backgrounds/bg-light.jpg)'}">

  <app-sidebar></app-sidebar>

  <div class="main-content flex-grow-1 d-flex flex-column">
    <app-navbar></app-navbar>

    <div class="content flex-grow-1">
      <!-- Header -->
      <div class="header mb-4 text-center" [ngClass]="theme.isDarkMode() ? 'header-dark' : 'header-light'">
        <h2>Dashboard</h2>
        <p class="subtitle">
          Visualize e gerencie as solicitações do sistema, acompanhando estatísticas e informações detalhadas.
        </p>
      </div>

      <!-- Skeleton / Estatísticas apenas para admin ou perito -->
      <ng-container *ngIf="showStats">
        <ng-container *ngIf="loading; else statsTemplate">
          <div class="skeleton-grid">
            <app-skeleton-card *ngFor="let __ of skeletonCards" [height]="'120px'"></app-skeleton-card>
          </div>
        </ng-container>

        <ng-template #statsTemplate>
          <app-dashboard-stats [stats]="stats"></app-dashboard-stats>
        </ng-template>
      </ng-container>

      <!-- Tabela de solicitações sempre renderizada -->
      <app-solicitacoes-table></app-solicitacoes-table>
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

.main-content {
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.content {
  margin-top: 60px;
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

/* Header */
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
.header .subtitle { margin-top: 0.5rem; font-size: 1rem; color: inherit; }

/* Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
app-skeleton-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { background-color: #f0f0f0; }
  50% { background-color: #e0e0e0; }
  100% { background-color: #f0f0f0; }
}

@media (max-width: 768px) {
  .main-content { margin-left: 0; width: 100%; }
}
  `]
})
export class DashboardComponent implements OnInit {
  stats: Record<string, number> | null = null;
  loading = true;
  skeletonCards = Array.from({ length: 8 });
  showStats = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    public theme: ThemeService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit() {
    // Título e descrição padrão da página
    this.titleService.setTitle('Dashboard - Sistema de Solicitações');
    this.metaService.updateTag({
      name: 'description',
      content: 'Visualize e gerencie as solicitações registradas no sistema, com gráficos e tabelas de desempenho.'
    });

    const user = this.auth.getUser();
    const roles = user?.roles ?? [];
    this.showStats = roles.includes('admin') || roles.includes('perito');

    if (!this.showStats) {
      this.loading = false;
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) { 
      console.error('Token não encontrado!'); 
      this.loading = false;
      return; 
    }

    const headers = new HttpHeaders({ 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.get<{ statistics: Record<string, number> }>(
      `${environment.apiUrl}/dashboard/stats`,
      { headers }
    ).subscribe({
      next: res => { 
        this.stats = res.statistics; 
        this.loading = false; 
        this.cdr.detectChanges(); 
      },
      error: err => { 
        this.loading = false; 
        console.error('Erro ao carregar estatísticas', err); 
      }
    });
  }
}
