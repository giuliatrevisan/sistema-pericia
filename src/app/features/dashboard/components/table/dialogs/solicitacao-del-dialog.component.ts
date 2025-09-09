import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { AuthService } from '../../../../../core/interceptors/auth.service';
@Component({
  selector: 'app-solicitacao-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <img src="assets/images/logos/logo-horizontal.png" alt="PEFOCE Logo" class="logo">
        <h2>Confirmar Exclusão</h2>
      </div>

      <p>Tem certeza que deseja excluir a seguinte solicitação?</p>
      <ul>
        <li><strong>Protocolo:</strong> {{ data.numero_protocolo }}</li>
        <li><strong>Responsável:</strong> {{ data.perito_responsavel }}</li>
        <li><strong>Cidade:</strong> {{ data.cidade }}</li>
        <li><strong>Delegacia:</strong> {{ data.delegacia }}</li>
        <li><strong>Tipo:</strong> {{ data.tipo_ocorrencia }}</li>
        <li><strong>Status:</strong> {{ data.status }}</li>
      </ul>

      <div class="dialog-actions">
        <button type="button" (click)="deletar()" class="delete-btn">Excluir</button>
        <button type="button" (click)="fechar()">Cancelar</button>
      </div>

      <p *ngIf="errorMsg" class="error-message">{{ errorMsg }}</p>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 32px;
      max-width: 500px;
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 8px;
    }

    .dialog-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 24px; }
    .logo { max-width: 180px; margin-bottom: 12px; }
    h2 { color: #000; margin: 0; text-align: center; }

    p, li { color: #000; font-size: 14px; line-height: 1.5; }
    ul { padding-left: 20px; margin-bottom: 24px; }
    li { margin-bottom: 4px; }

    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
    button { padding: 8px 20px; border: none; border-radius: 4px; cursor: pointer; color: #fff; font-size: 14px; }
    .delete-btn { background-color: #f44336; }
    button:last-child { background-color: #888; color: #fff; }

    .error-message { color: #f44336; margin-top: 12px; font-weight: 500; }
  `]
})
export class SolicitacaoDeleteDialogComponent {
  errorMsg: string | null = null;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private dialogRef: MatDialogRef<SolicitacaoDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  deletar() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${environment.apiUrl}/solicitacoes/${this.data.id}`, { headers })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => {
          if (err.status === 401) this.auth.logout();
          else this.errorMsg = err.error?.error || 'Erro ao deletar a solicitação.';
        }
      });
  }

  fechar() {
    this.dialogRef.close(false);
  }
}
