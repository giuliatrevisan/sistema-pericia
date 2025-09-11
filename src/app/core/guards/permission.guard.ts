import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../interceptors/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[] || [];
    const userRoles = this.authService.getUserRoles();

    if (!this.authService.isAuthenticated()) {
      // fallback (**)
      if (state.url === '/**') {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }

    // Se for fallback (rota inexistente), manda pro dashboard
    if (state.url === '/**') {
      this.router.navigate(['/dashboard']);
      return false;
    }

    // Se existem roles esperadas, verifica
    if (expectedRoles.length > 0) {
      const hasRole = userRoles.some(role => expectedRoles.includes(role));
      if (!hasRole) {
        this.router.navigate(['/acesso-negado']);
        return false;
      }
    }

    return true;
  }
}
