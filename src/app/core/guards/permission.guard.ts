// src/app/core/guards/permission.guard.ts

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
    const userRoles = this.authService.getUserRoles(); // <- corrigido

    // Se não estiver autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/acesso-negado']);
      return false;
    }

    // Verifica se o usuário possui pelo menos uma role esperada
    const hasRole = userRoles.some(role => expectedRoles.includes(role));
    if (!hasRole) {
      this.router.navigate(['/acesso-negado']);
      return false;
    }

    return true;
  }
}
