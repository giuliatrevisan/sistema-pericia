import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/interceptors/auth.service';

@Component({
  selector: 'app-solicitacoes-tabela',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatMenuModule, MatIconModule, MatButtonModule],
  providers: [DatePipe],
  template: `
<div class="table-responsive">
  <table mat-table [dataSource]="data"
         [ngClass]="{'dark-table': theme.isDarkMode()}"
         class="table table-hover align-middle w-100">

    <!-- Colunas Dinâmicas -->
    <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
      <th mat-header-cell *matHeaderCellDef
          [ngClass]="{'dark-row': theme.isDarkMode()}">
        {{ col.label }}
      </th>
      <td mat-cell *matCellDef="let element"
          [ngClass]="{'dark-row': theme.isDarkMode()}">

        <!-- Status com div fixa -->
        <ng-container *ngIf="col.key === 'status'; else normalCell">
          <div [ngClass]="getStatusClass(element.status)" class="status-badge">
            {{ element.status }}
          </div>
        </ng-container>

        <!-- Célula normal -->
        <ng-template #normalCell>
          {{ formatValue(col.key, element[col.key]) }}
        </ng-template>
      </td>
    </ng-container>

    <!-- Coluna Ações -->
    <ng-container matColumnDef="acoes">
      <th mat-header-cell *matHeaderCellDef [ngClass]="{'dark-sticky': theme.isDarkMode()}">
        Ações
      </th>
      <td mat-cell *matCellDef="let s" [ngClass]="{'dark-sticky': theme.isDarkMode()}">
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="visualizar.emit(s)">
            <mat-icon>visibility</mat-icon> Visualizar
          </button>
          <button *ngIf="canEditDelete" mat-menu-item (click)="editar.emit(s)">
            <mat-icon>edit</mat-icon> Editar
          </button>
          <button *ngIf="canEditDelete" mat-menu-item (click)="deletar.emit(s)">
            <mat-icon>delete</mat-icon> Deletar
          </button>
        </mat-menu>
      </td>
    </ng-container>

    <!-- Linhas -->
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
  `,
  styles: [`
/* Dark mode geral */
.dark-table { background-color: #222324; color: #fff; }
.dark-row { background-color: #222324 !important; color: #fff; }
.dark-sticky { background-color: #222324 !important; color: #fff; font-weight: 600; }
.dark-table .mat-row:hover { background-color: #2a2b2c !important; }

/* Status como div fixa */
.status-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 110px;          /* largura fixa */
  height: 28px;          /* altura fixa */
  border-radius: 14px;   /* cantos arredondados */
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover leve para destacar */
.status-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* cores por status */
.status-aberto { background-color: #28a745; }       /* verde */
.status-fechado { background-color: #dc3545; }     /* vermelho */
.status-em-andamento { background-color: #ffc107; color: #000; } /* amarelo */
.status-outro { background-color: #6c757d; }       /* cinza */
  `]
})
export class SolicitacoesTabelaComponent implements OnChanges {
  @Input() columns: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() data: any[] = [];

  @Output() visualizar = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() deletar = new EventEmitter<any>();

  canEditDelete = false; // controle de permissão

  constructor(
    public theme: ThemeService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    this.canEditDelete = this.authService.hasPermission('update_solicitacoes') &&
                         this.authService.hasPermission('delete_solicitacoes');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.cdr.detectChanges(); 
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'aberto': return 'status-badge status-aberto';
      case 'fechado': return 'status-badge status-fechado';
      case 'em andamento': return 'status-badge status-em-andamento';
      default: return 'status-badge status-outro';
    }
  }

  formatValue(key: string, value: any): string {
    if (!value) return 'Sem descrição';
    const dateColumns = ['dataCriacao', 'dataAtualizacao', 'data'];
    if (dateColumns.includes(key)) {
      return this.datePipe.transform(value, 'dd/MM/yyyy') || value;
    }
    return value;
  }
}
