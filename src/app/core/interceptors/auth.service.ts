import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

interface LoginResponse {
  access_token: string;
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

  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';

  login(username: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>('http://localhost:5000/api/auth/login', { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem(this.TOKEN_KEY, res.access_token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        }),
        map(() => {}),
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) return throwError(() => new Error('Não foi possível conectar ao servidor.'));
    if (error.status === 401) return throwError(() => new Error('Credenciais inválidas.'));
    return throwError(() => new Error('Erro no servidor. Tente novamente mais tarde.'));
  }
}
