import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfColumn {
  key: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  exportTable(
    columns: PdfColumn[], 
    data: any[], 
    title: string = 'Solicitações', 
    description: string = ''
  ) {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
  
    const today = new Date();
    const dateStr = today.toLocaleString();
  
    const img = new Image();
    img.src = 'assets/images/logos/logo-horizontal.png';
  
    img.onload = () => {
      const margin = 10;
      const logoWidth = 50;
      const logoHeight = 15;
  
      // Posições
      const headerTop = margin;
      const titleTop = headerTop + 2;
      const descriptionTop = titleTop + 6;
      const dataY = headerTop + logoHeight + 5; // posição da data embaixo do logo
  
      
        description = 'Segue abaixo o relatório das solicitações:';
      
  
      // Linha separadora abaixo do logo, data, título e descrição
      const lineY = Math.max(descriptionTop + 5, dataY + 3);
  
      // --- HEADER ---
  
      // Logo no canto superior direito
      const logoX = pageWidth - margin - logoWidth;
      doc.addImage(img, 'PNG', logoX, headerTop, logoWidth, logoHeight);
  
      // Data de geração abaixo da logo
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Gerado em: ${dateStr}`, logoX + logoWidth / 2, dataY, { align: 'center' });
  
      // Título à esquerda
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(33, 37, 41);
      doc.text(title, margin, titleTop);
  
      // Descrição abaixo do título
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(description, margin, descriptionTop);
  
      // Linha separadora
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(margin, lineY, pageWidth - margin, lineY);
  
      // --- TABELA ---
      const essentialKeys = ['id','data', 'status', 'cidade', 'tipo_ocorrencia', 'numero_protocolo', 'perito_responsavel', 'delegacia','observacoes'];
      const essentialColumns = columns.filter(c => essentialKeys.includes(c.key));
  
      const head = [essentialColumns.map(col => col.label)];
      const body = data.map(row => essentialColumns.map(col => row[col.key]));
  
      autoTable(doc, {
        startY: lineY + 5,
        head,
        body,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          valign: 'middle',
          overflow: 'linebreak',
          halign: 'left',
        },
        headStyles: {
          fillColor: [33, 37, 41],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'center',
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 10 },  // ID
          1: { cellWidth: 20 },  // Data
          2: { cellWidth: 18 },  // Status
          3: { cellWidth: 35 },  // Cidade
          4: { cellWidth: 35 },  // Tipo
          5: { cellWidth: 30 },  // Protocolo
          6: { cellWidth: 40 },  // Responsável
          7: { cellWidth: 35 },  // Delegacia
          8: { cellWidth: 50 },  // Observações
        },
        margin: { left: margin, right: margin, top: lineY + 5 },
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1,
        didDrawPage: (dataArg) => {
          if (dataArg.pageNumber > 1) {
            doc.addImage(img, 'PNG', logoX, headerTop, logoWidth, logoHeight);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Gerado em: ${dateStr}`, logoX + logoWidth / 2, dataY, { align: 'center' });
  
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(33, 37, 41);
            doc.text('title', margin, titleTop);
  
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(description, margin, descriptionTop);
  
            doc.setDrawColor(200);
            doc.setLineWidth(0.5);
            doc.line(margin, lineY, pageWidth - margin, lineY);
          }
        },
      });
  
      doc.save(`Solicitações.pdf`);
    };
  }
  
}
