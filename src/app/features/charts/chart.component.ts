import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chart, ChartData, ChartOptions, ArcElement, Tooltip, Legend, DoughnutController, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThemeService } from '../../core/services/theme.service';

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
    selector: 'app-relatorios-charts',
    standalone: true,
    imports: [CommonModule, BaseChartDirective, DragDropModule],
    template: `
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
  `,
    styles: [`
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
export class RelatoriosChartsComponent implements OnChanges {
    @Input() solicitacoes: Solicitacao[] = [];
    charts: Array<{ title: string, data: ChartData<any>, options: ChartOptions<any>, type: 'doughnut' | 'bar' }> = [];

    constructor(public theme: ThemeService) { }

    ngOnChanges() {
        if (!this.solicitacoes || this.solicitacoes.length === 0) return;

        // Contagem por status
        const statusCount = this.solicitacoes.reduce((acc, s) => {
            acc[s.status] = (acc[s.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Contagem por tipo de ocorrência
        const tipoCount = this.solicitacoes.reduce((acc, s) => {
            acc[s.tipo_ocorrencia] = (acc[s.tipo_ocorrencia] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Contagem por cidade
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

@Component({
    selector: 'app-relatorios',
    standalone: true,
    imports: [CommonModule, SidebarComponent, NavbarComponent, HttpClientModule, MatProgressSpinnerModule, RelatoriosChartsComponent],
    template: `
  <div class="dashboard-layout d-flex min-vh-100">
    <app-sidebar></app-sidebar>

    <div class="main-content flex-grow-1">
      <app-navbar class="sticky-top bg-light shadow-sm"></app-navbar>

      <div class="content p-3">
        <h2>Relatórios de Solicitações</h2>
        <div [ngClass]="theme.isDarkMode() ? 'p-3 rounded bg-dark text-light' : 'p-3 rounded bg-white text-dark'" style="margin-bottom: 1.5rem;">
  <p class="mb-0">
    Visualize a distribuição das solicitações registradas por status, tipo de ocorrência e cidade. 
    Utilize os gráficos interativos para análises rápidas.
  </p>
</div>

        <ng-container *ngIf="loading; else chartsTemplate">
          <div class="d-flex justify-content-center align-items-center" style="height:200px">
            <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
          </div>
        </ng-container>

        <ng-template #chartsTemplate>
          <app-relatorios-charts [solicitacoes]="solicitacoes"></app-relatorios-charts>
        </ng-template>
      </div>
    </div>
  </div>
  `,
    styles: [`
    .main-content { margin-left: 250px; }
    @media (max-width:767.98px) { .main-content { margin-left:0; } }
    .content { margin-top: 60px; overflow-y:auto; min-height:calc(100vh - 60px); }
  `]
})
export class RelatoriosComponent implements OnInit {
    loading = true;
    solicitacoes: Solicitacao[] = [];

    constructor(private http: HttpClient, private cdr: ChangeDetectorRef, public theme: ThemeService) {}

    ngOnInit() { this.carregarSolicitacoes(); }

    carregarSolicitacoes() {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.http.get<any>('http://localhost:5000/api/solicitacoes', { headers }).subscribe({
            next: res => {
                this.solicitacoes = res.solicitacoes || [];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: err => { console.error('Erro ao carregar solicitações', err); this.loading = false; this.cdr.detectChanges(); }
        });
    }
}
