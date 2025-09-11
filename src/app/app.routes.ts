import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UsersComponent } from './features/users/user.component';
import { PermissionGuard } from './core/guards/permission.guard';
import { AccessDeniedComponent } from './features/errors/access-denied/access-denied.component';
import { ServerErrorComponent } from './features/errors/server-error/server-error.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import {  RelatoriosComponent } from './features/charts/chart.component';
import { FaqsComponent } from './features/faqs/faqs.component';
import { UrgenciaComponent } from './features/urgencia/urgencia.component';
import { RecoverPasswordComponent } from './features/auth/recuperaçãoSenha/recover-password.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover', component: RecoverPasswordComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [PermissionGuard],
    data: { roles: ['user','admin','perito'], permissions: ['view_dashboard'] },
  },
  {
    path: 'relatorios',
    component: RelatoriosComponent,
    canActivate: [PermissionGuard],
    data: { roles: ['admin','perito'], permissions: ['view_dashboard'] },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [PermissionGuard],
    data: { roles: ['user','admin','perito'], permissions: ['view_dashboard'] },
  },

  {
    path: 'user', // rota protegida
    component: UsersComponent,
    canActivate: [PermissionGuard],
    data: { roles: ['admin'] }, // somente admin pode acessar
  },
  {
    path: 'faqs',
    component: FaqsComponent,
    canActivate: [PermissionGuard],
    data: { roles: ['user','admin','perito'], permissions: ['view_dashboard'] },
  },
  {
    path: 'urgencia',
    component: UrgenciaComponent,
    canActivate: [PermissionGuard],
    data: { roles: ['admin','perito'], permissions: ['view_dashboard'] },
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
