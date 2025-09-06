import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/interceptors/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Você está logado!</h1>
      <button (click)="logout()" [disabled]="loading()">Logout</button>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: Arial, sans-serif;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
    }
  `]
})
export class DashboardComponent {
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.loading.set(true);
    // opcional: delay simulado
    setTimeout(() => {
      this.auth.logout();
      this.loading.set(false);
    }, 200);
  }
}
