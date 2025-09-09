import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-solicitacoes-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
  <div class="d-flex justify-content-between align-items-center flex-wrap mb-3">
    <div>
      <h2 class="h5 mb-0">Solicitações</h2>
      <p class="text-muted small mb-0">Gerencie todas as solicitações de perícia cadastradas no sistema.</p>
    </div>
    <div class="d-flex gap-2 mt-2 mt-md-0">
      <button mat-raised-button color="primary" (click)="novo.emit()">
        <mat-icon>add</mat-icon> Adicionar
      </button>
      <button mat-raised-button color="accent" (click)="exportar.emit()">
        <mat-icon>picture_as_pdf</mat-icon> Exportar PDF
      </button>
    </div>
  </div>
  `
})
export class SolicitacoesHeaderComponent {
  @Output() novo = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<void>();
}
