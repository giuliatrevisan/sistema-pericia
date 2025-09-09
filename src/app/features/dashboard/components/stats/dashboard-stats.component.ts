import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, MatIconModule, DragDropModule],
  template: `
    <div class="stats-cards" *ngIf="statEntries" cdkDropList (cdkDropListDropped)="drop($event)">
      <div class="stat-card" *ngFor="let stat of statEntries; let i = index"
           [ngClass]="{'dark-card': isDarkMode()}"
           cdkDrag [cdkDragData]="i">
        <div class="stat-content">
          <div class="stat-icon" [ngStyle]="{'background-color': stat.color}">
            <mat-icon [ngClass]="{'dark-text': isDarkMode()}">{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-title" [ngClass]="{'dark-text': isDarkMode()}">{{ stat.key }}</div>
            <div class="stat-value" [ngClass]="{'dark-text': isDarkMode()}">{{ stat.value }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      flex: 1 1 150px;
      height: 70px;
      background-color: var(--primary-color);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s, background-color 0.3s;
      display: flex;
      cursor: grab;
    }

    .stat-card.dark-card {
      background-color: var(--sidebar-color);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 6px rgba(0,0,0,0.15);
    }

    .stat-content {
      display: flex;
      width: 100%;
    }

    .stat-icon {
      flex: 0 0 30%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 28px;
    }

    .stat-info {
      flex: 0 0 70%;
      padding: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-title {
      font-size: 10px;
      font-weight: 500;
      color: #555;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 600;
      color: #000;
    }

    .dark-text {
      color: white !important;
    }

    @media (max-width: 767.98px) {
      .stat-card { flex: 1 1 40%; }
    }
  `]
})
export class DashboardStatsComponent {
  @Input() stats: Record<string, number> | null = null;

  // Mapeamento de ícones por estatística
  private materialIcons: Record<string, string> = {
    "Cobrança": 'request_quote',
    "Em custódia do Núcleo": 'folder_shared',
    "Enviados ao SIP": 'send',
    "Laudos Para Revisão": 'rate_review',
    "Laudos Pendentes": 'pending_actions',
    "Laudos para Correção": 'edit',
    "Novas Solicitações": 'add_circle',
    "Não Pertencem ao SIP": 'block',
    "Pendentes de envio ao SIP": 'forward_to_inbox',
    "Perícias Concluídas": 'check_circle',
    "Perícias Em Andamento": 'autorenew',
    "Recebidas por Perito": 'inbox',
    "SVO - Laudos Pendentes": 'schedule',
    "Solicitações Devolvidas": 'undo',
    "Solicitações Distribuidas": 'send_and_archive',
    "Solicitações Pausadas": 'pause_circle',
    "Solicitações Recebidas": 'mail'
  };

  // Cores diferentes para cada card
  private colors: string[] = [
    '#e91e63','#9c27b0','#3f51b5','#2196f3','#00bcd4','#4caf50','#ffc107','#ff9800',
    '#ff5722','#795548','#607d8b','#8bc34a','#cddc39','#f44336','#673ab7','#009688','#ffeb3b'
  ];

  // Lista com estado atual para drag & drop
  statEntriesArray: Array<{key:string, value:number, icon:string, color:string}> = [];

  get statEntries() {
    if (!this.stats) return [];
    if (!this.statEntriesArray.length) {
      const keys = Object.keys(this.stats);
      this.statEntriesArray = keys.map((key, index) => ({
        key,
        value: this.stats![key],
        icon: this.materialIcons[key] || 'insert_chart',
        color: this.colors[index % this.colors.length]
      }));
    }
    return this.statEntriesArray;
  }

  // Função para fazer a troca de posição entre dois itens
  drop(event: CdkDragDrop<string[]>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    // Troca de posição direta
    if (previousIndex !== currentIndex) {
      const temp = this.statEntriesArray[previousIndex];
      this.statEntriesArray[previousIndex] = this.statEntriesArray[currentIndex];
      this.statEntriesArray[currentIndex] = temp;
    }
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }
}
