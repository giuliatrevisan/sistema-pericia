import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-solicitacoes-filtros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
  <div class="d-flex flex-wrap gap-2 mb-3">
    <mat-form-field appearance="fill">
      <mat-label>Status</mat-label>
      <mat-select (selectionChange)="statusChange.emit($event.value)">
        <mat-option value="">Todos</mat-option>
        <mat-option value="Aberto">Aberto</mat-option>
        <mat-option value="Fechado">Fechado</mat-option>
        <mat-option value="Em andamento">Em andamento</mat-option>

      </mat-select>
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Cidade</mat-label>
      <input matInput (input)="cidadeChange.emit($event.target.value)" placeholder="Cidade">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Tipo</mat-label>
      <input matInput (input)="tipoChange.emit($event.target.value)" placeholder="Tipo de ocorrência">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Delegacia</mat-label>
      <input matInput (input)="delegaciaChange.emit($event.target.value)" placeholder="Delegacia">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Protocolo</mat-label>
      <input matInput (input)="protocoloChange.emit($event.target.value)" placeholder="Protocolo">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Responsável</mat-label>
      <input matInput (input)="responsavelChange.emit($event.target.value)" placeholder="Responsável">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Observações</mat-label>
      <input matInput (input)="observacoesChange.emit($event.target.value)" placeholder="Observações">
    </mat-form-field>
  </div>
  `
})
export class SolicitacoesFiltrosComponent {
  @Output() statusChange = new EventEmitter<string>();
  @Output() cidadeChange = new EventEmitter<string>();
  @Output() tipoChange = new EventEmitter<string>();
  @Output() delegaciaChange = new EventEmitter<string>();
  @Output() protocoloChange = new EventEmitter<string>();
  @Output() responsavelChange = new EventEmitter<string>();
  @Output() observacoesChange = new EventEmitter<string>();
}
