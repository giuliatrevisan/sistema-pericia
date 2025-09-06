import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guards';
import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] } // só admin pode acessar
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // ⚠ pathMatch deve ser 'full'
];
