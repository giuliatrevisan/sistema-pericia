import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/navbar/navbar.component';
import { SolicitacoesTableComponent } from './solicitacoes-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, SolicitacoesTableComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar></app-sidebar>

      <div class="main-content">
        <app-navbar></app-navbar>

        <div class="content">
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
      background-color: var(--bg-color, #f5f5f5);
    }

    .main-content {
      margin-left: 250px; /* largura da sidebar */
      width: calc(100% - 250px);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      color: var(--text-color, #333);
    }

    .content {
      margin-top: 60px; /* altura da navbar */
      padding: 1rem;
      flex: 1;
      overflow-y: auto;
      color: var(--text-color, #333);
    }

    /* Responsividade para dispositivos menores */
    @media (max-width: 767.98px) {
      .main-content {
        margin-left: 0;
        width: 100%;
      }
    }

    /* Opcional: estilo para a tabela dentro do dashboard */
    .content table {
      width: 100%;
      border-collapse: collapse;
    }

    .content th, .content td {
      padding: 0.5rem;
      text-align: left;
      border: 1px solid #ddd;
    }

    .content th {
      background-color: #f0f0f0;
    }
  `]
})
export class DashboardComponent {}
