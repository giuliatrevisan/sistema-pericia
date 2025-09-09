import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/navbar/navbar.component';
import { SolicitacoesTableComponent } from './components/table/solicitacoes-table.component';
import { DashboardStatsComponent } from './components/stats/dashboard-stats.component';
import { SkeletonCardComponent } from './components/stats/components/skeleton/skeleton-card.component';

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
          <!-- Skeleton / Estatísticas -->
          <ng-container *ngIf="loading; else statsTemplate">
            <div class="skeleton-grid">
              <app-skeleton-card *ngFor="let __ of skeletonCards" [height]="'100px'"></app-skeleton-card>
            </div>
          </ng-container>

          <ng-template #statsTemplate>
            <app-dashboard-stats [stats]="stats"></app-dashboard-stats>
          </ng-template>

          <!-- Tabela de solicitações -->
          <app-solicitacoes-table></app-solicitacoes-table>
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
      padding: 1.5rem;
      flex: 1;
      overflow-y: auto;
    }

    .skeleton-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(4, 1fr); /* desktop: 4 por linha */
      margin-bottom: 1.5rem;
    }

    @media (max-width: 767.98px) {
      .main-content { margin-left: 0; width: 100%; }
      .skeleton-grid {
        grid-template-columns: repeat(2, 1fr); /* mobile: 2 por linha */
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: Record<string, number> | null = null;
  loading = true;

  // Desktop: 4x4 / Mobile: 2x2
  skeletonCards = Array.from({ length: 8 });

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }
  
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    this.http.get<{ statistics: Record<string, number> }>(
      'http://localhost:5000/api/dashboard/stats',
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
