import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThemeService } from '../../core/services/theme.service';
import { environment } from '../../environments/environments';
import { SolicitacaoViewDialogComponent } from '../dashboard/components/table/dialogs/solicitacao-view-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Chart.js
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);

interface Solicitacao {
    id: number;
    titulo: string;
    status: string;
    prioridade: number;
    descricao?: string;
    created_at: string;
    numero_protocolo: string;
    data: string;
    dataPtBr: string;

}



@Component({
    selector: 'app-urgencia',
    standalone: true,
    imports: [
        CommonModule,
        SidebarComponent,
        NavbarComponent,
        DragDropModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    template: `
<div class="dashboard-layout d-flex min-vh-100"
     [ngStyle]="{'background-image': theme.isDarkMode() ? 'url(/assets/images/backgrounds/bg-dark.jpg)' : 'url(/assets/images/backgrounds/bg-light.jpg)'}">
  
  <app-sidebar></app-sidebar>

  <div class="main-content flex-grow-1">
    <app-navbar class="sticky-top bg-light shadow-sm"></app-navbar>

    <div class="content p-3">
      <!-- Título e legenda -->
      <div class="header mb-4 text-center">
        <h2>Solicitações de Urgência</h2>
        <p class="subtitle">Arraste para reorganizar ou clique para visualizar detalhes</p>
      </div>

      <!-- Loading -->
      <ng-container *ngIf="loading">
        <div class="d-flex justify-content-center align-items-center" style="height:200px">
          <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
        </div>
      </ng-container>

      <!-- Error -->
      <ng-container *ngIf="!loading && hasError">
        <div class="alert alert-danger text-center" role="alert">
          Erro ao carregar solicitações. Tente novamente mais tarde.
        </div>
      </ng-container>

      <!-- Empty -->
      <ng-container *ngIf="!loading && !hasError && solicitacoes.length === 0">
        <div class="alert alert-info text-center" role="alert">
          Nenhuma solicitação pendente.
        </div>
      </ng-container>

      <!-- Conteúdo -->
      <ng-container *ngIf="!loading && !hasError && solicitacoes.length > 0">
        <div class="cards-container" cdkDropList (cdkDropListDropped)="drop($event)">
          <div *ngFor="let s of solicitacoes; let i = index" 
               class="card"
               cdkDrag
               (click)="abrirSolicitacao(s)"
               [ngClass]="theme.isDarkMode() ? 'card-dark' : 'card-light'">
            
            <!-- Barra de status -->
            <div class="status-bar" [ngStyle]="{'background-color': getStatusColor(s.status)}"></div>

            <!-- Ícone dentro de círculo -->
            <div class="circle-icon">
              <span>{{ i + 1 }}</span>
            </div>
            <div class="card-content" [ngClass]="theme.isDarkMode() ? 'text-light' : 'text-dark'">
  <h4>{{ s.titulo }}</h4>
  <p>Protocolo: {{ s.numero_protocolo }}</p>
  <p>Data: {{ s.dataPtBr }}</p>
  <p>Status: {{ s.status }}</p>
  <p *ngIf="s.descricao">{{ s.descricao }}</p>
</div>

          </div>
        </div>

        <!-- Seção de gráficos -->
        <div class="charts-container mt-5">
  <div class="chart-box" [ngClass]="theme.isDarkMode() ? 'chart-box-dark' : ''">
    <h5>Status das Solicitações</h5>
    <canvas id="statusChart"></canvas>
  </div>
  <div class="chart-box" [ngClass]="theme.isDarkMode() ? 'chart-box-dark' : ''">
    <h5>Mês com Mais Ocorrências</h5>
    <canvas id="monthChart"></canvas>
  </div>
</div>

      </ng-container>
    </div>
  </div>
</div>
  `,
    styles: [`
    .cards-container { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 1rem; 
      justify-content: center; 
    }
    
    .card { 
      position: relative; 
      flex: 1 1 250px; 
      max-width: 300px; 
      padding: 1rem; 
      border-radius: 12px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
      cursor: grab; 
      transition: transform 0.2s ease; 
    }
    
    .card.cdk-drag-dragging { 
      cursor: grabbing; 
      transform: scale(1.03); 
    }
    
    .card-light { 
      background-color: #fff; 
      color: #333; 
    }
    
    .card-dark { 
      background-color: #2c2c2c; 
      color: #f0f0f0; 
    }
    
    .chart-box canvas {
      width: 100% !important;  /* ocupa 100% do container */
      max-width: 300px;         /* limitar tamanho máximo */
      height: 300px !important; /* altura fixa */
    }
    
    .status-bar { 
      height: 6px; 
      width: 100%; 
      border-radius: 6px 6px 0 0; 
    }
    
    .circle-icon { 
      width: 50px; 
      height: 50px; 
      border-radius: 50%; 
      background-color: #fff; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      box-shadow: 0 2px 6px rgba(0,0,0,0.2); 
      position: absolute; 
      top: -25px; 
      left: calc(50% - 25px); 
      font-weight: bold; 
      color: #333; 
    }
    
    .card-content { 
      margin-top: 30px; 
      text-align: center; 
    }
    
    .charts-container { 
      display: flex; 
      gap: 2rem; 
      flex-wrap: wrap; 
      justify-content: center; 
      margin-top: 2rem; 
    }
    
    .chart-box { 
      flex: 1 1 300px; 
      background-color: var(--chart-bg, #fff); 
      border-radius: 12px; 
      padding: 1rem; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .chart-box h5 {
      align-self: flex-start; 
      margin-bottom: 1rem;
    }
    
    .chart-box-dark {
      background-color: #2c2c2c;  /* fundo escuro */
      color: #f0f0f0;             /* texto claro */
    }
    
    .main-content { 
      margin-left: 250px; 
      transition: margin 0.3s ease;
    }
    
    @media (max-width:767.98px) { 
      .main-content { 
        margin-left:0; 
      } 
    }
    
    .content { 
      margin-top: 60px; 
      min-height: calc(100vh - 60px); 
      overflow-y: auto; 
      padding: 1.5rem; 
    }
    
    .header {
      padding: 1rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      text-align: center;
      margin-bottom: 2rem;
      background-color: rgba(255, 255, 255, 0.2); /* default light */
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    :host-context(.dark-mode) .header {
  background-color: #2c2c2c !important;  /* fundo muito escuro */
  color: #ffffff;            /* título branco */
  box-shadow: 0 4px 12px rgba(0,0,0,0.5); /* sombra mais evidente */
}

:host-context(.dark-mode) .header h2,
:host-context(.dark-mode) .header p {
  color: #ffffff; /* título e descrição brancos */
}

    :host-context(:not(.dark-mode)) .header {
      background-color: rgba(255, 255, 255, 0.8); /* light mode com pouca opacidade */
      color: #333;
    }
    `]

})
export class UrgenciaComponent implements OnInit {
    solicitacoes: Solicitacao[] = [];
    loading = true;
    hasError = false;

    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        public theme: ThemeService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.carregarSolicitacoes();
    }

    carregarSolicitacoes() {
        this.loading = true;
        this.hasError = false;

        const token = localStorage.getItem('token');
        if (!token) { this.hasError = true; this.loading = false; return; }

        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.http.get<{ pagination: any, solicitacoes: Solicitacao[] }>(
            `${environment.apiUrl}/solicitacoes?status_ne=fechada&_limit=10&_sort=created_at&_order=asc`,
            { headers }
        ).subscribe({
            next: data => {
                // filtra apenas os que não estão fechados
                this.solicitacoes = data.solicitacoes
                    .filter(s => s.status.toLowerCase() !== 'fechado')
                    .map(s => ({
                        ...s,
                        data: s.created_at.split('T')[0],   // formata a data como YYYY-MM-DD
                        dataPtBr: new Date(s.data).toLocaleDateString('pt-BR') // transforma YYYY-MM-DD em DD/MM/YYYY

                    }));
                this.loading = false;
                this.cdr.detectChanges();
                this.renderCharts(); // renderiza os gráficos
            },
            error: err => {
                console.error(err);
                this.hasError = true;
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    drop(event: CdkDragDrop<Solicitacao[]>) {
        moveItemInArray(this.solicitacoes, event.previousIndex, event.currentIndex);
    }

    abrirSolicitacao(s: Solicitacao) {
        this.dialog.open(SolicitacaoViewDialogComponent, {
            width: '500px',
            data: s
        });
    }

    getStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'em andamento': return '#28a745'; // verde
            case 'aberto': return '#ffc107'; // amarelo
            default: return '#6c757d'; // cinza
        }
    }

    renderCharts() {
        // Status chart
        const statusCount: Record<string, number> = {};
        this.solicitacoes.forEach(s => {
            const key = s.status;
            statusCount[key] = (statusCount[key] || 0) + 1;
        });

        new Chart('statusChart', {
            type: 'pie',
            data: {
                labels: Object.keys(statusCount),
                datasets: [{
                    data: Object.values(statusCount),
                    backgroundColor: ['#28a745', '#ffc107', '#6c757d']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Month chart
        // Month chart
        const monthCount: Record<string, number> = {};
        this.solicitacoes.forEach(s => {
            if (!s.created_at) return; // garante que não seja undefined
            const createdAt = s.created_at.replace(' ', 'T'); // Corrige invalid date
            const month = new Date(createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthCount[month] = (monthCount[month] || 0) + 1;
        });

        new Chart('monthChart', {
            type: 'bar',
            data: {
                labels: Object.keys(monthCount),
                datasets: [{
                    label: 'Ocorrências',
                    data: Object.values(monthCount),
                    backgroundColor: '#007bff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

}
