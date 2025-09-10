import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environments';
import { AuthService } from '../../../../../core/interceptors/auth.service';

@Component({
  selector: 'app-user-add-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="dialog-container">
  <div class="dialog-header">
    <img src="assets/images/logos/logo-horizontal.png" alt="Logo" class="logo">
    <h2>Adicionar Usuário</h2>
  </div>

  <form [formGroup]="form" (ngSubmit)="salvar()" class="dialog-form">

    <div *ngIf="errorMsg" class="error-message">
      <p>{{ errorMsg }}</p>
    </div>

    <div class="form-row">
      <div class="form-item">
        <label>Usuário</label>
        <input type="text" formControlName="username" placeholder="Nome do usuário">
        <div class="field-error" *ngIf="form.get('username')?.invalid && (form.get('username')?.touched || submitted)">
          Usuário é obrigatório
        </div>
      </div>

      <div class="form-item">
        <label>Email</label>
        <input type="email" formControlName="email" placeholder="Email">
        <div class="field-error" *ngIf="form.get('email')?.invalid && (form.get('email')?.touched || submitted)">
          Email é obrigatório
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-item">
        <label>Senha</label>
        <input type="password" formControlName="password" placeholder="Senha">
        <div class="field-error" *ngIf="form.get('password')?.invalid && (form.get('password')?.touched || submitted)">
          Senha é obrigatória (mínimo 6 caracteres)
        </div>
      </div>

      <div class="form-item">
        <label>Função</label>
        <select formControlName="role">
          <option value="" disabled>Selecione a função</option>
          <option value="admin">Admin</option>
          <option value="perito">Perito</option>
          <option value="user">User</option>
        </select>
        <div class="field-error" *ngIf="form.get('role')?.invalid && (form.get('role')?.touched || submitted)">
          Função é obrigatória
        </div>
      </div>
    </div>

    <div class="dialog-actions">
      <button type="submit">Adicionar</button>
      <button type="button" (click)="fechar()">Cancelar</button>
    </div>
  </form>
</div>
  `,
  styles: [`
.dialog-container {
  padding: 32px;
  max-width: 450px;
  width: 100%;
  background-color: #f8f9fa;
  border-radius: 8px;
}
.dialog-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}
.logo { max-width: 180px; margin-bottom: 12px; }
h2 { margin: 0; text-align: center; color: #333; font-weight: 600; }
.dialog-form { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: flex; gap: 4%; flex-wrap: wrap; }
.form-item { flex: 1 1 48%; display: flex; flex-direction: column; gap: 4px; }
label { font-weight: 500; color: #333; }
input, select { width: 100%; height: 32px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; transition: border-color 0.3s, box-shadow 0.3s; }
input:focus, select:focus { border-color: #007bff; box-shadow: 0 0 3px rgba(0,123,255,0.5); outline: none; }
.field-error { color: #f44336; font-size: 12px; margin-top: 2px; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
button { padding: 6px 16px; border: none; border-radius: 4px; cursor: pointer; }
button[type="submit"] { background-color: #007bff; color: white; }
button[type="button"] { background-color: #f44336; color: white; }
.error-message p { color: #f44336; font-weight: 500; margin: 0 0 12px 0; }
@media (max-width: 768px) { .form-item { flex: 1 1 100%; } }
  `]
})
export class UserAddDialogComponent {
  form: any;
  errorMsg: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private dialogRef: MatDialogRef<UserAddDialogComponent>
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  salvar() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.errorMsg = null;

    const payload = {
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      role: this.form.value.role
    };

    this.http.post(`${environment.apiUrl}/auth/register`, payload)
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error?.error || 'Ocorreu um erro ao adicionar o usuário.';
        }
      });
  }

  fechar(success: boolean = false) {
    this.dialogRef.close(success);
  }
}
