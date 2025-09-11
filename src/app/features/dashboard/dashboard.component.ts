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
   <div class="dashboard-layout">
  <app-sidebar></app-sidebar>

  <div class="main-content">
    <app-navbar></app-navbar>

    <div class="content">
      <!-- Skeleton / Estatísticas apenas para admin ou perito -->
      <ng-container *ngIf="showStats">
        <ng-container *ngIf="loading; else statsTemplate">
          <div class="skeleton-grid">
            <app-skeleton-card *ngFor="let __ of skeletonCards" [height]="'100px'"></app-skeleton-card>
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
  styles: [
    `.main-content {
      margin-left: 250px;
      width: calc(100% - 250px);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .content {
      margin-top: 60px;
      padding: 1.5rem;
      flex: 1;
      overflow-y: auto;
    }
    `
  ]
})
export class DashboardComponent implements OnInit {
  stats: Record<string, number> | null = null;
  loading = true;
  skeletonCards = Array.from({ length: 8 });
  showStats = false; // só mostra stats se admin/perito

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    const roles = user?.roles ?? [];
    this.showStats = roles.includes('admin') || roles.includes('perito');

    if (!this.showStats) {
      this.loading = false; // não precisa do skeleton
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ statistics: Record<string, number> }>(
      `${environment.apiUrl}/dashboard/stats`,
      { headers }
    ).subscribe({
      next: (res) => {
        this.stats = res.statistics;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao carregar estatísticas', err);
      }
    });
  }
}
