import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserAddDialogComponent } from './dialogs/user-create-dialog.component';

@Component({
  selector: 'app-users-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>Usuários</h3>
      <button mat-raised-button class="btn-azul" (click)="abrirDialog()">
        <mat-icon>add</mat-icon>
        Novo Usuário
      </button>
    </div>
  `,
  styles: [`
    .btn-azul {
      background-color: #1976d2 !important;
      color: #fff !important;
    }
    .btn-azul:hover {
      background-color: #115293 !important;
    }
    button mat-icon {
      margin-right: 4px;
    }
  `]
})
export class UsersHeaderComponent {
  constructor(private dialog: MatDialog) {}

  abrirDialog() {
    const dialogRef = this.dialog.open(UserAddDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aqui você pode atualizar a tabela de usuários após criar um novo
        console.log('Usuário criado com sucesso!');
      }
    });
  }
}
