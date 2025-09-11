import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environments';
import { AuthService } from '../../../../../core/interceptors/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-solicitacao-edit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="dialog-container">
  <div class="dialog-header">
    <img src="assets/images/logos/logo-horizontal.png" alt="PEFOCE Logo" class="logo">
    <h2>Editar Solicitação</h2>
  </div>

  <form [formGroup]="form" (ngSubmit)="salvar()" class="dialog-form">

    <div class="form-row">
      <div class="form-item">
        <label>Status</label>
        <select formControlName="status">
          <option value="Aberto">Aberto</option>
          <option value="Fechado">Fechado</option>
          <option value="Em andamento">Em andamento</option>
        </select>
        <div class="field-error" *ngIf="form.get('status')?.invalid && (form.get('status')?.touched || submitted)">
          Status é obrigatório
        </div>
      </div>
      <div class="form-item">
        <label>Delegacia</label>
        <input type="text" formControlName="delegacia" placeholder="Delegacia">
        <div class="field-error" *ngIf="form.get('delegacia')?.invalid && (form.get('delegacia')?.touched || submitted)">
          Delegacia é obrigatória
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-item">
        <label>Cidade</label>
        <input type="text" formControlName="cidade" placeholder="Cidade">
        <div class="field-error" *ngIf="form.get('cidade')?.invalid && (form.get('cidade')?.touched || submitted)">
          Cidade é obrigatória
        </div>
      </div>
      <div class="form-item">
        <label>Tipo de Ocorrência</label>
        <input type="text" formControlName="tipo_ocorrencia" placeholder="Tipo de Ocorrência">
        <div class="field-error" *ngIf="form.get('tipo_ocorrencia')?.invalid && (form.get('tipo_ocorrencia')?.touched || submitted)">
          Tipo de ocorrência é obrigatório
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-item">
        <label>Número do Protocolo</label>
        <input type="text" formControlName="numero_protocolo" placeholder="Número do Protocolo">
        <div class="field-error" *ngIf="form.get('numero_protocolo')?.invalid && (form.get('numero_protocolo')?.touched || submitted)">
          Número do protocolo é obrigatório
        </div>
      </div>
      <div class="form-item">
        <label>Perito Responsável</label>
        <input type="text" formControlName="perito_responsavel" placeholder="Perito Responsável">
        <div class="field-error" *ngIf="form.get('perito_responsavel')?.invalid && (form.get('perito_responsavel')?.touched || submitted)">
          Perito responsável é obrigatório
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-item full-width">
        <label>Observações</label>
        <textarea formControlName="observacoes" rows="3" placeholder="Observações"></textarea>
      </div>
    </div>

    <div class="dialog-actions">
      <button type="submit">Salvar</button>
      <button type="button" (click)="fechar()">Cancelar</button>
    </div>
  </form>
</div>
  `,
  styles: [`
.dialog-container {
  padding: 32px;
  max-width: 550px;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.dialog-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}
.logo {
  max-width: 180px;
  margin-bottom: 12px;
}
h2 {
  margin: 0;
  text-align: center;
  color: #333;
  font-weight: 600;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-row {
  display: flex;
  gap: 4%;
  flex-wrap: wrap;
}
.form-item {
  flex: 1 1 48%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.full-width { flex: 1 1 100%; }
label { font-weight: 500; color: #333; }
input, select, textarea {
  width: 100%;
  height: 32px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #000;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}
textarea { height: auto; }
input:focus, select:focus, textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 3px rgba(0,123,255,0.5);
  outline: none;
}
.field-error { color: #f44336; font-size: 12px; margin-top: 2px; }
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}
button {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button[type="submit"] { background-color: #007bff; color: white; }
button[type="button"] { background-color: #f44336; color: white; }
.error-message p { color: #f44336; font-weight: 500; margin: 0 0 12px 0; }

@media (max-width: 768px) { .form-item { flex: 1 1 100%; } }
  `]
})
export class SolicitacaoEditDialogComponent {
  form: any;
  errorMsg: string = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<SolicitacaoEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      status: [data?.status || 'Aberto', Validators.required],
      delegacia: [data?.delegacia || '', Validators.required],
      cidade: [data?.cidade || '', Validators.required],
      tipo_ocorrencia: [data?.tipo_ocorrencia || '', Validators.required],
      numero_protocolo: [data?.numero_protocolo || '', Validators.required],
      perito_responsavel: [data?.perito_responsavel || '', Validators.required],
      observacoes: [data?.observacoes || '']
    });
  }
  salvar() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.errorMsg = 'Solicitação editada com sucesso!';
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const payload = { ...this.form.value };
  
    this.http.put(`${environment.apiUrl}/solicitacoes/${this.data.id}`, payload, { headers })
      .subscribe({
        next: () => {
          this.snackBar.open('Solicitação atualizada com sucesso!', 'Fechar', {
            duration: 4000,
            panelClass: ['snack-success']
          });
          this.dialogRef.close(true);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.auth.logout();
            this.snackBar.open('Sessão expirada. Faça login novamente.', 'Fechar', {
              duration: 4000,
              panelClass: ['snack-warning']
            });
          } else {
            this.errorMsg = err.error?.error || 'Ocorreu um erro ao atualizar a solicitação.';
            this.snackBar.open(this.errorMsg, 'Fechar', {
              duration: 4000,
              panelClass: ['snack-error']
            });
          }
        }
      });
  }
  fechar(success: boolean = false) {
    this.dialogRef.close(success);
  }
}
