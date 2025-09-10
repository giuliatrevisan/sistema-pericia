import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../interceptors/auth.service';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="text-center p-4" style="min-width: 300px;">
      <!-- Logo -->
      <img src="assets/images/logos/logo-horizontal.png" alt="Pefoce" style="width: 120px; height:auto;" />

      <!-- Título -->
      <h2 class="mb-2">Confirmação de Logout</h2>
      <p class="mb-4 text-secondary">{{ data.message }}</p>

      <!-- Botões -->
      <div class="d-flex justify-content-center gap-3">
        <button mat-stroked-button color="primary" (click)="close(false)">
          Cancelar
        </button>
        <button mat-flat-button color="warn" (click)="logout()">
          Sair
        </button>
      </div>
    </div>
  `,
  styles: [`
    h2 {
      font-weight: 600;
    }
    p {
      font-size: 0.95rem;
    }

  `]
})
export class LogoutDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialogRef: MatDialogRef<LogoutDialogComponent>,
    private auth: AuthService,
    private router: Router
  ) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }

  logout() {
    this.auth.logout();
    this.dialogRef.close(true);
    this.router.navigate(['/login']);
  }
}
