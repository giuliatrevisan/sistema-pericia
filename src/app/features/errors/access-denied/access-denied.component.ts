import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card text-center shadow p-4" style="max-width: 400px;">
        <div class="card-body">
          <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 3rem;"></i>
          <h3 class="card-title mt-3">Acesso Negado</h3>
          <p class="card-text">Você não tem permissão para acessar esta página.</p>
          <button class="btn btn-primary mt-3" (click)="goBack()">Voltar para Dashboard</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* estilos adicionais se necessário */
  `]
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
