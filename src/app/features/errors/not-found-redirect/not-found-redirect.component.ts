import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/interceptors/auth.service';

@Component({
  selector: 'app-not-found-redirect',
  template: `<p>Redirecionando...</p>`
})
export class NotFoundRedirectComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  constructor() {
    const user = this.auth.getUser();
    if (user) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
