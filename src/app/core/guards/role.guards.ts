// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../interceptors/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data?.['roles'] as string[] || [];

  const user = auth.getUser();
  const hasRole = user?.roles.some((r: string) => requiredRoles.includes(r));

  if (hasRole) return true;

  router.navigate(['/login']); // ou página de acesso negado
  return false;
};
