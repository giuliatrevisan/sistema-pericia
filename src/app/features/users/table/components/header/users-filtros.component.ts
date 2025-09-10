import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-users-filtros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
  <div class="filtros-container">
    <!-- Username -->
    <mat-form-field appearance="fill">
      <mat-label>Usuário</mat-label>
      <input matInput (input)="usernameChange.emit($event.target.value)" placeholder="Buscar por usuário">
    </mat-form-field>

    <!-- Email -->
    <mat-form-field appearance="fill">
      <mat-label>Email</mat-label>
      <input matInput (input)="emailChange.emit($event.target.value)" placeholder="Buscar por email">
    </mat-form-field>

    <!-- Função -->
    <mat-form-field appearance="fill">
      <mat-label>Função</mat-label>
      <mat-select (selectionChange)="roleChange.emit($event.value)">
        <mat-option value="">Todas</mat-option>
        <mat-option value="admin">Admin</mat-option>
        <mat-option value="perito">Perito</mat-option>
        <mat-option value="user">User</mat-option>
      </mat-select>
    </mat-form-field>

    <!-- Ativo -->
    <mat-form-field appearance="fill">
      <mat-label>Ativo</mat-label>
      <mat-select (selectionChange)="ativoChange.emit($event.value)">
        <mat-option value="">Todos</mat-option>
        <mat-option value="true">Ativo</mat-option>
        <mat-option value="false">Inativo</mat-option>
      </mat-select>
    </mat-form-field>
  </div>
  `,
  styles: [`
    .filtros-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .filtros-container mat-form-field {
      flex: 1;
      min-width: 200px; /* garante largura mínima */
    }

    /* Mobile: força 1 por linha */
    @media (max-width: 768px) {
      .filtros-container {
        flex-direction: column;
      }
      .filtros-container mat-form-field {
        width: 100%;
      }
    }
  `]
})
export class UsersFiltrosComponent {
  @Output() usernameChange = new EventEmitter<string>();
  @Output() emailChange = new EventEmitter<string>();
  @Output() roleChange = new EventEmitter<string>();
  @Output() ativoChange = new EventEmitter<string>();
}

