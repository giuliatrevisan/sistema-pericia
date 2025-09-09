import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-solicitacoes-tabela',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatMenuModule, MatIconModule, MatButtonModule],
  providers: [DatePipe], // garante injeção do DatePipe
  template: `
 <div class="table-responsive">
  <table mat-table [dataSource]="data" matSort
         [ngClass]="{'dark-table': theme.isDarkMode()}"
         class="table table-hover align-middle">

    <!-- Colunas Dinâmicas -->
    <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
      <th mat-header-cell *matHeaderCellDef mat-sort-header
          [ngClass]="{'dark-row': theme.isDarkMode()}">
        {{ col.label }}
      </th>
      <td mat-cell *matCellDef="let element"
          [ngClass]="{'dark-row': theme.isDarkMode()}">

        <!-- Badge para status -->
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
      <th mat-header-cell *matHeaderCellDef
          [ngClass]="{'dark-sticky': theme.isDarkMode()}"
          class="sticky-col bg-light">Ações</th>
      <td mat-cell *matCellDef="let s"
          [ngClass]="{'dark-sticky': theme.isDarkMode()}"
          class="sticky-col bg-light">
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="visualizar.emit(s)">
            <mat-icon>visibility</mat-icon> Visualizar
          </button>
          <button mat-menu-item (click)="editar.emit(s)">
            <mat-icon>edit</mat-icon> Editar
          </button>
          <button mat-menu-item (click)="deletar.emit(s)">
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
    .dark-row { background-color: #222324 !important; color: #fff !important; }
    .dark-sticky { background-color: #222324 !important; color: #fff !important; font-weight: 600; }
    .dark-table .mat-row:hover { background-color: #2a2b2c !important; }

    /* Badge de status */
    .status-badge {
      display: inline-block;
      width: 100px;        /* largura fixa */
      height: 30px;        /* altura fixa */
      line-height: 30px;   /* centraliza verticalmente o texto */
      border-radius: 15px; /* metade da altura para arredondar completamente */
      font-weight: 600;
      font-size:12px;
      color: #fff;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-aberto { background-color: #4caf50; }       /* Verde */
    .status-fechado { background-color: #f44336; }     /* Vermelho */
    .status-em-andamento { background-color: #ff9800; }/* Laranja */
    .status-outro { background-color: #9e9e9e; }       /* Cinza para status desconhecido */
  `]
})
export class SolicitacoesTabelaComponent implements OnChanges {
  @Input() columns: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() data: any[] = [];

  @Output() visualizar = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() deletar = new EventEmitter<any>();

  constructor(
    public theme: ThemeService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.cdr.detectChanges(); // força atualização da tabela
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

    // lista de colunas que são datas
    const dateColumns = ['dataCriacao', 'dataAtualizacao', 'data'];

    if (dateColumns.includes(key)) {
      return this.datePipe.transform(value, 'dd/MM/yyyy') || value;
    }
    return value;
  }
}
