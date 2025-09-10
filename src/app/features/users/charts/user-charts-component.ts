import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, ArcElement, Tooltip, Legend, DoughnutController, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThemeService } from '../../../core/services/theme.service';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarController, BarElement);

@Component({
  selector: 'app-users-charts',
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
  .charts-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
  }

  .chart-card {
    flex: 1 1 300px;
    max-width: 400px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }


  h4 {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  /* Limita altura dos canvas */
  .chart-card canvas {
    max-height: 250px;
    width: 100% !important;
  }

  .chart-card {
  flex: 1 1 300px;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  /* cursor de drag */
  cursor: grab;
}

.chart-card.cdk-drag-dragging {
  cursor: grabbing; /* enquanto arrastando */
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}


  @media (max-width: 768px) {
    .charts-container {
      flex-direction: column;
      gap: 1rem;
    }
    .chart-card { max-width: 95%; margin: 0 auto; }
  }
`]

})
export class UsersChartsComponent implements OnChanges {
  @Input() users: any[] = [];

  charts: Array<{title:string, data:ChartData<any>, options:ChartOptions<any>, type:'doughnut'|'bar'}> = [];

  constructor(public theme: ThemeService) {}

  ngOnChanges() {
    if (!this.users || this.users.length === 0) return;

    const ativos = this.users.filter(u => u.active).length;
    const inativos = this.users.length - ativos;

    const rolesCount = this.users.reduce((acc: any, u: any) => {
      const role = u.roles?.[0] || 'user';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.charts = [
      {
        title: 'Status de Usuários',
        type: 'doughnut',
        data: { labels: ['Ativos', 'Inativos'], datasets: [{ data: [ativos, inativos], backgroundColor: ['#4caf50', '#f44336'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }
      },
      {
        title: 'Distribuição de Funções',
        type: 'bar',
        data: { labels: Object.keys(rolesCount), datasets: [{ label: 'Quantidade', data: Object.values(rolesCount), backgroundColor: ['#1976d2', '#ff9800', '#9c27b0', '#009688', '#f44336'] }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Funções' } }, y: { title: { display: true, text: 'Quantidade' }, beginAtZero: true } } }
      }
    ];
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.charts, event.previousIndex, event.currentIndex);
  }
}
