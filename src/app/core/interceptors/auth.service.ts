// src/app/core/interceptors/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environments';

interface LoginResponse {
  access_token: string; // JWT
  user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
    active: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly USER_KEY = 'user';

  private permissionsMap: Record<string, string[]> = {
    admin: [
      'read_solicitacoes',
      'create_solicitacoes',
      'update_solicitacoes',
      'delete_solicitacoes',
      'view_dashboard',
      'manage_users',
      'manage_roles',
    ],
    perito: [
      'read_solicitacoes',
      'create_solicitacoes',
      'update_solicitacoes',
      'delete_solicitacoes',
      'view_dashboard',
    ],
    user: [
      'read_solicitacoes',
      'create_solicitacoes',
    ],
  };

  /** Login */
  login(username: string, password: string): Observable<void> {
    const url = `${environment.apiUrl}/auth/login`; // usa a URL do environment
    return this.http.post<LoginResponse>(url, { username, password }).pipe(
      tap(res => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        localStorage.setItem('token', res.access_token); // armazenando JWT
      }),
      map(() => { }),
      catchError(this.handleError)
    );
  }

  register(username: string, email: string, password: string) {
    const url = `${environment.apiUrl}/auth/register`;
    return this.http.post<{ message: string; user: any }>(url, { username, email, password }).pipe(
      catchError(this.handleError)
    );
  }

  /** Logout */
  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  /** Obter usuário */
  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /** Roles e permissões */
  getUserRoles(): string[] {
    return this.getUser()?.roles ?? [];
  }

  getUserPermissions(): string[] {
    return this.getUserRoles().flatMap(role => this.permissionsMap[role] || []);
  }

  hasPermission(permission: string): boolean {
    return this.getUserPermissions().includes(permission);
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  private handleError(error: any) {
    if (error.error && error.error.error) {
      // servidor retornou JSON no formato { error: "mensagem" }
      return throwError(() => new Error(error.error.error));
    }
  
    if (error.status === 0) {
      return throwError(() => new Error('Não foi possível conectar ao servidor.'));
    }
  
    if (error.status === 401) {
      return throwError(() => new Error('Credenciais inválidas.'));
    }
  
    return throwError(() => new Error('Erro no servidor. Tente novamente mais tarde.'));
  }
  
}
