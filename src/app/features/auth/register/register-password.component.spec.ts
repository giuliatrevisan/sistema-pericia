import { Component, OnInit, signal, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/interceptors/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  template: `
<div class="register-wrapper">
  <form [formGroup]="form" (ngSubmit)="submit()" class="register-form">

    <div class="form-header">
      <div class="form-logo">
        <img src="assets/images/logos/logo-horizontal.png" alt="Logo Perícia Forense" />
      </div>
      <h2>Registrar Usuário</h2>
      <p class="description">
        Cadastro de peritos e administradores deve ser feito apenas por um administrador.
        Aqui é a criação de um usuário comum.
      </p>
    </div>

    <div class="row">
      <div class="input-group">
        <label for="username">Usuário</label>
        <input id="username" type="text" formControlName="username" placeholder="Digite seu usuário" />
      </div>

      <div class="input-group">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" placeholder="Digite seu email" />
      </div>
    </div>

    <div class="row">
      <div class="input-group">
        <label for="password">Senha</label>
        <input id="password" type="password" formControlName="password" placeholder="Digite sua senha" />
      </div>

      <div class="input-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input id="confirmPassword" type="password" formControlName="confirmPassword" placeholder="Confirme sua senha" />
        <div *ngIf="form.errors?.['mismatch'] && form.get('confirmPassword')?.touched" class="error">
          As senhas não coincidem
        </div>
      </div>
    </div>

    <button type="submit" [disabled]="loading()">
      {{ loading() ? 'Registrando...' : 'Registrar' }}
    </button>

    <div class="links">
      <a [routerLink]="'/login'">Já possui conta? Faça login</a>
    </div>

  </form>
</div>
  `,
  styles: [`
.register-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: var(--carousel-image);
    background-size: cover;
    background-position: center;
    transition: background-image 1s ease-in-out;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 200%; height: 200%;
    background: rgba(255, 255, 255, 0.03);
    clip-path: ellipse(60% 40% at 50% 100%);
    animation: wave 6s linear infinite;
    z-index: 1;
  }

  @keyframes wave {
    0% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(-25%) translateY(15px); }
    100% { transform: translateX(0) translateY(0); }
  }

  .register-form {
    position: relative;
    z-index: 2;
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 700px;
    width: 100%;

    .form-header {
      text-align: center;
      margin-bottom: 1rem;
      .form-logo img { width: 180px; margin-bottom: 0.5rem; }
      h2 { color: #0f4c75; }
      .description { font-size: 0.85rem; color: #333; margin-top: 0.25rem; }
    }

    .row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .row .input-group { flex: 1 1 48%; }
    .input-group { display: flex; flex-direction: column; gap: 0.4rem; }
    label { font-size: 0.85rem; font-weight: 600; color: #0f4c75; }
    input { padding: 1rem; border-radius: 14px; border: 1px solid #ccc; background: #f7f8fa; font-size: 0.95rem; box-sizing: border-box;
      &:focus { border-color: #00b894; box-shadow: 0 0 8px rgba(0, 184, 148, 0.4); outline: none; }
    }
    .error { color: #e74c3c; font-size: 0.85rem; }

    button {
      padding: 1rem;
      background: #00b894;
      color: white;
      font-weight: 700;
      border-radius: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0, 184, 148, 0.4); }
      &:disabled { background: #66d9b3; cursor: not-allowed; }
    }

    .links { display: flex; justify-content: center; font-size: 0.8rem; margin-top: 0.5rem; a { color: #0f4c75; text-decoration: none; &:hover { color: #00b894; } } }
  }
}
  `]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);

  images = [
    'assets/images/carousel/img1.png',
    'assets/images/carousel/img2.png',
    'assets/images/carousel/img3.png'
  ];
  currentImage = signal(0);

  constructor(private fb: FormBuilder, private auth: AuthService, private snackBar: MatSnackBar, private el: ElementRef) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  ngOnInit() {
    this.updateBackground();
    setInterval(() => {
      this.currentImage.set((this.currentImage() + 1) % this.images.length);
      this.updateBackground();
    }, 5000);
  }

  updateBackground() {
    const wrapper = this.el.nativeElement.querySelector('.register-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.style.setProperty('--carousel-image', `url('${this.images[this.currentImage()]}')`);
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);

    const { username, email, password } = this.form.value;

    this.auth.register(username, email, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Registro realizado com sucesso!', 'Fechar', {
            duration: 4000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.form.reset();
        },
        error: (err: Error) => {
          this.snackBar.open(`Erro: ${err.message}`, 'Fechar', {
            duration: 4000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      });
  }
}
