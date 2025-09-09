//app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PermissionGuard } from './core/guards/permission.guard';
import { AccessDeniedComponent } from './features/errors/access-denied/access-denied.component';
import { ServerErrorComponent } from './features/errors/server-error/server-error.component';
import { RegisterComponent } from './features/auth/register/register.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [PermissionGuard],
    data: { roles: ['user','admin','perito'], permissions: ['view_dashboard'] },
  },
  { path: 'acesso-negado', component: AccessDeniedComponent },
  { path: 'erro-servidor', component: ServerErrorComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // SPA fallback
  {
    path: '**',
    canActivate: [PermissionGuard],
    component: DashboardComponent, // o guard vai redirecionar se não estiver logado
  },
];

