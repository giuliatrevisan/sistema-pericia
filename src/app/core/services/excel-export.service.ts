import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  exportXLSM(data: any[], fileName: string = 'Solicitacoes') {
    if (!data || data.length === 0) return;

    // Define nomes amigáveis para as colunas
    const columnMapping: Record<string, string> = {
      id: 'ID',
      data: 'Data',
      hora: 'Hora',
      status: 'Status',
      delegacia: 'Delegacia',
      cidade: 'Cidade',
      tipo_ocorrencia: 'Tipo de Ocorrência',
      numero_protocolo: 'Número do Protocolo',
      perito_responsavel: 'Perito Responsável',
      observacoes: 'Observações'
    };

    // Mapeia os dados para usar os nomes amigáveis
    const formattedData = data.map(row => {
      const newRow: Record<string, any> = {};
      for (const key in columnMapping) {
        newRow[columnMapping[key]] = row[key] ?? '';
      }
      return newRow;
    });

    // Cria worksheet e workbook
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitacoes');

    // Gera arquivo XLSX
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  }

}
