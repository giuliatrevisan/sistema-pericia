import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="error-container">
      <mat-card>
        <mat-card-header>
          <!-- Logo -->
          <img src="assets/images/logo-pefoce.png"
               alt="Logo Pefoce"
               class="logo" />

          <!-- Ícone e título -->
          <mat-icon color="warn" class="icon">error</mat-icon>
          <mat-card-title>Erro no Servidor</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <p>Ocorreu um erro inesperado no servidor. Tente novamente mais tarde.</p>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goBack()">
            Voltar
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }

    mat-card {
      max-width: 420px;
      padding: 1rem;
      text-align: center;
    }

    .logo {
      display: block;
      max-width: 120px;
      margin: 0 auto 1rem auto;
    }

    .icon {
      font-size: 40px;
      margin-right: 10px;
      vertical-align: middle;
    }
  `]
})
export class ServerErrorComponent {
  constructor(private router: Router) {}

  goBack() {
    const token = localStorage.getItem('token'); // ou use seu AuthService
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
