import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/interceptors/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="login-container">
    <form [formGroup]="form" (ngSubmit)="submit($event)">
      <h2>Login</h2>
      <input formControlName="username" type="text" placeholder="Usuário" />
      <input formControlName="password" type="password" placeholder="Senha" />
      <button type="submit" [disabled]="loading()">Entrar</button>
      <div *ngIf="error() !== ''" class="error">{{ error() }}</div>
    </form>
  </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(event?: Event) {
    event?.preventDefault(); // previne reload
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    const { username, password } = this.form.value;

    this.auth.login(username, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err: Error) => this.error.set(err.message)
      });
  }
}
