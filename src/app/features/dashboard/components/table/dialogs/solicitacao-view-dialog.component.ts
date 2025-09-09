import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-solicitacao-view-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <img src="assets/images/logos/logo-horizontal.png" alt="PEFOCE Logo" class="logo">
        <h2>Visualizar Solicitação</h2>
      </div>

      <ul>
        <li><strong>Protocolo:</strong> {{ data.numero_protocolo }}</li>
        <li><strong>Responsável:</strong> {{ data.perito_responsavel }}</li>
        <li><strong>Cidade:</strong> {{ data.cidade }}</li>
        <li><strong>Delegacia:</strong> {{ data.delegacia }}</li>
        <li><strong>Tipo:</strong> {{ data.tipo_ocorrencia }}</li>
        <li><strong>Status:</strong> {{ data.status }}</li>
        <li><strong>Observações:</strong> {{ data.observacoes || '-' }}</li>
      </ul>

      <div class="dialog-actions">
        <button type="button" (click)="baixarPDF()">Baixar PDF</button>
        <button type="button" (click)="fechar()">Fechar</button>
      </div>
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
    li { margin-bottom: 6px; }

    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
    button { padding: 8px 20px; border: none; border-radius: 4px; cursor: pointer; color: #fff; font-size: 14px; }
    button:first-child { background-color: #007bff; }
    button:last-child { background-color: #888; }
  `]
})
export class SolicitacaoViewDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SolicitacaoViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  fechar() {
    this.dialogRef.close();
  }

  baixarPDF() {
    const doc = new jsPDF();
  
    // Cria uma função para converter a imagem em base64
    const loadImageAsBase64 = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Erro ao criar contexto do canvas');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => reject(err);
      });
    };
  
    loadImageAsBase64('assets/images/logos/logo-horizontal.png')
      .then(base64 => {
        // Adiciona a logo
        doc.addImage(base64, 'PNG', 20, 10, 50, 15);
  
        doc.setFontSize(18);
        doc.text('Solicitação', 105, 40, { align: 'center' });
  
        doc.setFontSize(12);
        let y = 55;
  
        // Data e hora
        const now = new Date();
        doc.setFont('helvetica', 'bold');
        doc.text('Data:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 60, y);
        y += 10;
        // Campos relevantes
        const campos = [
          { label: 'N. Protocolo', value: this.data.numero_protocolo },
          { label: ' Responsável', value: this.data.perito_responsavel },
          { label: 'Cidade', value: this.data.cidade },
          { label: 'Delegacia', value: this.data.delegacia },
          { label: 'Tipo de Ocorrência', value: this.data.tipo_ocorrencia },
          { label: 'Status', value: this.data.status },
          { label: 'Observações', value: this.data.observacoes || '-' }
        ];
  
        campos.forEach(c => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${c.label}:`, 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(`${c.value}`, 60, y);
            y += 10;
          });
  
        doc.save(`solicitacao_${this.data.numero_protocolo || 'sem_protocolo'}.pdf`);
      })
      .catch(err => console.error('Erro ao carregar logo:', err));
  }
  
  
}
