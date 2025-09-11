import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chart, ChartData, ChartOptions, ArcElement, Tooltip, Legend, DoughnutController, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThemeService } from '../../core/services/theme.service';
import { environment } from '../../environments/environments';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarController, BarElement);

interface Solicitacao {
  cidade: string;
  status: string;
  tipo_ocorrencia: string;
  delegacia: string;
  perito_responsavel: string;
  data: string;
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    HttpClientModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
    DragDropModule
  ],
  template: `
<div class="dashboard-layout d-flex min-vh-100"
     [ngStyle]="{'background-image': theme.isDarkMode() ? 'url(/assets/images/backgrounds/bg-dark.jpg)' : 'url(/assets/images/backgrounds/bg-light.jpg)'}">
  
  <app-sidebar></app-sidebar>

  <div class="main-content flex-grow-1">
    <app-navbar class="sticky-top bg-light shadow-sm"></app-navbar>

    <div class="content p-3">
      <!-- Header -->
      <div class="header mb-4 text-center" [ngClass]="theme.isDarkMode() ? 'header-dark' : 'header-light'">
        <h2>Relatórios de Solicitações</h2>
        <p class="subtitle">
          Visualize a distribuição das solicitações registradas por status, tipo de ocorrência e cidade.
          Utilize os gráficos interativos para análises rápidas.
        </p>
      </div>

      <!-- Loading -->
      <ng-container *ngIf="loading">
        <div class="d-flex justify-content-center align-items-center" style="height:200px">
          <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
        </div>
      </ng-container>

      <!-- Empty -->
      <ng-container *ngIf="!loading && solicitacoes.length === 0">
        <div class="alert alert-info text-center" role="alert">
          Nenhuma solicitação encontrada.
        </div>
      </ng-container>

      <!-- Gráficos -->
      <ng-container *ngIf="!loading && solicitacoes.length > 0">
        <div class="charts-container" cdkDropList (cdkDropListDropped)="drop($event)">
          <div class="chart-card"
               *ngFor="let chart of charts; let i = index"
               cdkDrag
               [ngClass]="theme.isDarkMode() ? 'bg-dark text-light' : 'bg-light text-dark'">
            <h4>{{ chart.title }}</h4>
            <canvas baseChart
                    [data]="chart.data"
                    [type]="chart.type"
                    [options]="chart.options">
            </canvas>
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
.main-content { margin-left: 250px; }
@media (max-width:767.98px) { .main-content { margin-left:0; } }
.content { margin-top: 60px; overflow-y:auto; min-height:calc(100vh - 60px); }

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

/* Gráficos */
.charts-container { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; }
.chart-card { flex: 1 1 300px; max-width: 400px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 1rem; cursor: grab; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.chart-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
.chart-card.cdk-drag-dragging { cursor: grabbing; }
h4 { text-align: center; margin-bottom: 0.5rem; }
canvas { max-height: 250px; width: 100% !important; }
@media (max-width: 768px) {
  .charts-container { flex-direction: column; gap: 1rem; }
  .chart-card { max-width: 95%; margin: 0 auto; }
}
  `]
})
export class RelatoriosComponent implements OnInit {
  loading = true;
  solicitacoes: Solicitacao[] = [];
  charts: Array<{ title: string, data: ChartData<any>, options: ChartOptions<any>, type: 'doughnut' | 'bar' }> = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, public theme: ThemeService) {}

  ngOnInit() {
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`${environment.apiUrl}/solicitacoes`, { headers }).subscribe({
      next: res => {
        this.solicitacoes = res.solicitacoes || [];
        this.generateCharts();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erro ao carregar solicitações', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  generateCharts() {
    if (!this.solicitacoes || this.solicitacoes.length === 0) return;

    const statusCount = this.solicitacoes.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tipoCount = this.solicitacoes.reduce((acc, s) => {
      acc[s.tipo_ocorrencia] = (acc[s.tipo_ocorrencia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cidadeCount = this.solicitacoes.reduce((acc, s) => {
      const c = s.cidade || 'Desconhecida';
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.charts = [
      {
        title: 'Solicitações por Status',
        type: 'doughnut',
        data: { labels: Object.keys(statusCount), datasets: [{ data: Object.values(statusCount), backgroundColor: ['#4caf50', '#f44336', '#ff9800'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }
      },
      {
        title: 'Solicitações por Tipo de Ocorrência',
        type: 'bar',
        data: { labels: Object.keys(tipoCount), datasets: [{ label: 'Quantidade', data: Object.values(tipoCount), backgroundColor: ['#1976d2', '#ff9800', '#9c27b0', '#009688', '#f44336'] }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Tipo' } }, y: { beginAtZero: true, title: { display: true, text: 'Quantidade' } } } }
      },
      {
        title: 'Solicitações por Cidade',
        type: 'bar',
        data: { labels: Object.keys(cidadeCount), datasets: [{ label: 'Quantidade', data: Object.values(cidadeCount), backgroundColor: ['#3f51b5', '#e91e63', '#009688', '#ff5722', '#ffc107'] }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Cidade' } }, y: { beginAtZero: true, title: { display: true, text: 'Quantidade' } } } }
      }
    ];
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.charts, event.previousIndex, event.currentIndex);
  }
}
