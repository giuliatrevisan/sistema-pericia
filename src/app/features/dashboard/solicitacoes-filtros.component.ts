import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';

// Adapter customizado para dd/MM/yyyy
export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = this._to2digit(date.getDate());
    const month = this._to2digit(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private _to2digit(n: number) {
    return n < 10 ? '0' + n : n;
  }
}

// Formatos personalizados
export const APP_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-solicitacoes-filtros',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  template: `
  <div class="d-flex flex-wrap gap-2 mb-3">
    <!-- Status -->
    <mat-form-field appearance="outline">
      <mat-label>Status</mat-label>
      <mat-select (selectionChange)="statusChange.emit($event.value)">
        <mat-option value="">Todos</mat-option>
        <mat-option value="Aberto">Aberto</mat-option>
        <mat-option value="Fechado">Fechado</mat-option>
        <mat-option value="Em andamento">Em andamento</mat-option>
      </mat-select>
    </mat-form-field>

    <!-- Cidades (multiselect) -->
    <mat-form-field appearance="outline">
      <mat-label>Cidade</mat-label>
      <mat-select multiple (selectionChange)="cidadeChange.emit($event.value)">
        <mat-option *ngFor="let c of cidades" [value]="c">{{ c }}</mat-option>
      </mat-select>
    </mat-form-field>

    <!-- Tipo -->
    <mat-form-field appearance="outline">
      <mat-label>Tipo</mat-label>
      <input matInput (keyup)="tipoChange.emit($event.target.value)" placeholder="Filtrar por tipo">
    </mat-form-field>

    <!-- Período -->
    <mat-form-field appearance="outline">
      <mat-label>Período</mat-label>
      <mat-date-range-input [rangePicker]="picker">
        <input matStartDate placeholder="Início" (dateChange)="onDateChange($event, 'start')">
        <input matEndDate placeholder="Fim" (dateChange)="onDateChange($event, 'end')">
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>

    <!-- Pesquisa geral -->
    <mat-form-field appearance="outline" class="flex-grow-1 min-w-150px">
      <mat-label>Pesquisar geral</mat-label>
      <input matInput (keyup)="pesquisa.emit($event.target.value)" placeholder="Pesquisar em todas colunas">
    </mat-form-field>
  </div>
  `
})
export class SolicitacoesFiltrosComponent implements OnInit {
  @Output() statusChange = new EventEmitter<string>();
  @Output() cidadeChange = new EventEmitter<string[]>();
  @Output() tipoChange = new EventEmitter<string>();
  @Output() pesquisa = new EventEmitter<string>();
  @Output() periodoChange = new EventEmitter<{ start: Date|null, end: Date|null }>();

  cidades: string[] = [];
  selectedCidades: string[] = [];
  periodo: { start: Date|null, end: Date|null } = { start: null, end: null };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarCidades();
  }

  carregarCidades() {
    this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/CE/municipios')
      .subscribe(res => this.cidades = res.map(c => c.nome).sort());
  }

  onDateChange(event: any, type: 'start' | 'end') {
    const date: Date | null = event.value instanceof Date ? event.value : null;
    this.periodo[type] = date;
    this.periodoChange.emit({ ...this.periodo });
  }
  
}
