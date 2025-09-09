import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { AuthService } from '../../core/interceptors/auth.service';

@Component({
  selector: 'app-solicitacao-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Nova Solicitação</h2>
    <form [formGroup]="form" (ngSubmit)="salvar()" class="dialog-form">

      <div *ngIf="errorMsg" class="error-message">
        <p>{{ errorMsg }}</p>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="Aberto">Aberto</mat-option>
            <mat-option value="Fechado">Fechado</mat-option>
            <mat-option value="Em andamento">Em andamento</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Delegacia</mat-label>
          <input matInput formControlName="delegacia" required>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Cidade</mat-label>
          <input matInput formControlName="cidade" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Tipo de Ocorrência</mat-label>
          <input matInput formControlName="tipo_ocorrencia" required>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Número do Protocolo</mat-label>
          <input matInput formControlName="numero_protocolo" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Perito Responsável</mat-label>
          <input matInput formControlName="perito_responsavel" required>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observações</mat-label>
          <textarea matInput formControlName="observacoes" rows="3"></textarea>
        </mat-form-field>
      </div>

      <div class="dialog-actions">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Salvar</button>
        <button mat-raised-button color="warn" type="button" (click)="dialogRef.close()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    .dialog-form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      /* Tema dinâmico */
      background-color: var(--dialog-bg);
      color: var(--text-color);
      border-radius: 8px;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .form-row { display: flex; gap: 4%; flex-wrap: wrap; }
    .full-width { width: 100%; }
    .half-width { width: 48%; }

    mat-form-field {
      background-color: var(--dialog-bg);
      color: var(--text-color);
      border-radius: 6px;
    }

    mat-form-field.mat-focused .mat-form-field-outline {
      border-color: var(--text-color);
    }

    input, textarea, mat-select {
      color: var(--text-color);
    }

    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }

    h2 {
      margin: 0 0 16px 0;
      font-weight: 600;
      color: var(--text-color);
    }

    .error-message p {
      color: #f44336;
      font-weight: 500;
      margin: 0 0 12px 0;
    }
  `]
})
export class SolicitacaoDialogComponent {
  form: any; // FormGroup
  errorMsg: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<SolicitacaoDialogComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      status: ['Aberto', Validators.required],
      delegacia: ['', Validators.required],
      cidade: ['', Validators.required],
      tipo_ocorrencia: ['', Validators.required],
      numero_protocolo: ['', Validators.required],
      perito_responsavel: ['', Validators.required],
      observacoes: ['']
    });
  }

  private getCurrentDate(): string {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  private getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  salvar() {
    if (this.form.invalid) return;

    this.errorMsg = null;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const payload = {
      ...this.form.value,
      data: this.getCurrentDate(),
      hora: this.getCurrentTime()
    };

    this.http.post(`${environment.apiUrl}/solicitacoes`, payload, { headers })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.auth.logout();
            this.dialogRef.close();
          } else if (err.error?.error) {
            this.errorMsg = err.error.error;
          } else {
            console.error('Erro ao salvar solicitação', err);
            this.errorMsg = 'Ocorreu um erro ao salvar a solicitação.';
          }
        }
      });
  }
}