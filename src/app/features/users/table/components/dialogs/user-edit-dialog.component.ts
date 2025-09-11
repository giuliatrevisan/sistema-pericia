import { Component, Inject, PLATFORM_ID,ChangeDetectorRef,NgZone   } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environments';
import { AuthService } from '../../../../../core/interceptors/auth.service';
import { ThemeService } from '../../../../../core/services/theme.service';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  template: `
<div class="dialog-container">
  <div class="dialog-header">
    <img src="assets/images/logos/logo-horizontal.png" alt="Logo" class="logo">
    <h2>Editar Usuário</h2>
  </div>

  <form [formGroup]="form" (ngSubmit)="salvar()" class="dialog-form">



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
      <div class="form-item">
        <label>Ativo</label>
        <select formControlName="ativo">
          <option [value]="true">Sim</option>
          <option [value]="false">Não</option>
        </select>
      </div>
    </div>

    <label>Não existe rota no back (aqui é só ilustrativo)</label>

    <div class="dialog-actions">
      <button type="submit">Salvar</button>
      <button type="button" (click)="fechar()">Cancelar</button>
    </div>
  </form>
</div>
  `,
  styles: [`
/* Seu CSS existente */
.dialog-container { padding: 32px; max-width: 450px; width: 100%; background-color: #f8f9fa; border-radius: 8px; }
.dialog-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 24px; }
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
@media (max-width: 768px) { .form-item { flex: 1 1 100%; } }
  `]
})
export class UserEditDialogComponent {
  form: any;
  errorMsg: string = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private dialogRef: MatDialogRef<UserEditDialogComponent>,
    private snackBar: MatSnackBar,
    public theme: ThemeService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,   

    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.fb.group({
      username: [data?.username || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      role: [data?.roles?.[0] || '', Validators.required],
      ativo: [data?.active ?? true, Validators.required]
    });
  }

  salvar() {
    this.submitted = true;
    if (this.form.invalid) return;
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const payload = { ...this.form.value };
  
    this.http.put(`${environment.apiUrl}/admin/users/${this.data.id}`, payload, { headers })
      .subscribe({
        next: () => {
          this.ngZone.run(() => {   // <-- roda dentro do ciclo Angular
            const msg = 'Usuário atualizado com sucesso';
            if (isPlatformBrowser(this.platformId)) {
              this.snackBar.open(msg, 'Fechar', {
                duration: 4000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: this.theme.isDarkMode() ? 'toast-dark' : 'toast-light'
              });
            }
            this.cd.detectChanges();
            this.dialogRef.close(true);
          });
        },
        error: (err: HttpErrorResponse) => {
          this.ngZone.run(() => {   // <-- força ciclo Angular
            if (err.status === 401) this.auth.logout();
            else {
              this.errorMsg = err.error?.error || 'Ocorreu um erro ao atualizar o usuário.';
              if (isPlatformBrowser(this.platformId)) {
                this.snackBar.open(this.errorMsg, 'Fechar', {
                  duration: 4000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: this.theme.isDarkMode() ? 'toast-dark' : 'toast-light'
                });
              }
              this.cd.detectChanges();  // atualiza view
            }
          });
        }
      });
  }

  fechar(success: boolean = false) {
    this.dialogRef.close(success);
  }
}
