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
      <p class="text-muted small mb-0">
        Gerencie todas as solicitações de perícia cadastradas no sistema.
      </p>
    </div>
    <div class="d-flex gap-2 mt-2 mt-md-0">
      <!-- Botão Adicionar -->
      <button mat-raised-button (click)="novo.emit()" class="btn-adicionar">
        <mat-icon>add</mat-icon> Adicionar
      </button>

      <!-- Botão Exportar PDF -->
      <button mat-raised-button (click)="exportarPDF.emit()" class="btn-pdf">
        <mat-icon>picture_as_pdf</mat-icon> Exportar PDF
      </button>

      <!-- Botão Exportar excel -->
      <button mat-raised-button (click)="exportarExcel.emit()" class="btn-xml">
  <mat-icon>description</mat-icon> Exportar Excel
</button>

    </div>
  </div>
  `,
  styles: [`
.btn-adicionar { background-color: #0f4c75 !important; color: white !important; }
.btn-pdf { background-color: #FF8855 !important; color: white !important; }
.btn-xml { background-color: #00b894 !important; color: white !important; }

  `]
})
export class SolicitacoesHeaderComponent {
  @Output() novo = new EventEmitter<void>();
  @Output() exportarPDF = new EventEmitter<void>();
  @Output() exportarExcel = new EventEmitter<void>();

}
