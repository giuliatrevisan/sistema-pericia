import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-users-tabela',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  template: `
    <div class="table-responsive">
      <table mat-table [dataSource]="data"
             [ngClass]="{'dark-table': theme.isDarkMode()}"
             class="table table-hover align-middle w-100">

        <!-- Colunas dinâmicas -->
        <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
          <th mat-header-cell *matHeaderCellDef
              [ngClass]="{'dark-row': theme.isDarkMode()}">
            {{ col.label }}
          </th>
          <td mat-cell *matCellDef="let element"
              [ngClass]="{'dark-row': theme.isDarkMode()}">
            <ng-container [ngSwitch]="col.key">
              <span *ngSwitchCase="'roles'">{{ element.roles.join(', ') }}</span>
              <span *ngSwitchCase="'active'">{{ element.active ? 'Sim' : 'Não' }}</span>
              <span *ngSwitchDefault>{{ element[col.key] }}</span>
            </ng-container>
          </td>
        </ng-container>

        <!-- Coluna Ações -->
        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef
              [ngClass]="{'dark-sticky': theme.isDarkMode()}">
            Edição
          </th>
          <td mat-cell *matCellDef="let element"
              [ngClass]="{'dark-sticky': theme.isDarkMode()}">
            <button mat-icon-button class="btn-editar" (click)="editar.emit(element)">
              <mat-icon>edit</mat-icon>
            </button>
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

    /* ícones de ação */
    .btn-editar mat-icon { color: #1976d2; } /* azul */
    .btn-editar:hover mat-icon { color: #115293; }
  `]
})
export class UsersTabelaComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() displayedColumns: string[] = [];

  @Output() editar = new EventEmitter<any>();

  constructor(public theme: ThemeService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.cdr.detectChanges();
    }
  }
}

