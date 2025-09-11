import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Dashboard</h2>
      <p *ngIf="loading">Carregando...</p>
      <p *ngIf="!loading && stats">Estatísticas carregadas: {{ stats | json }}</p>
      <p *ngIf="!loading && !stats">Nenhuma estatística disponível.</p>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; font-family: Arial, sans-serif; }
    h2 { color: #0f4c75; }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: Record<string, number> | null = null;

  ngOnInit() {
    // Simula carregamento de estatísticas
    setTimeout(() => {
      this.stats = { totalSolicitacoes: 42, pendentes: 10, concluídas: 32 };
      this.loading = false;
    }, 1000);
  }
}
