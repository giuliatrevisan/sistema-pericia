import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../../../core/services/theme.service';
import { environment } from '../../../../environments/environments';
import { PdfExportService } from '../../../../core/services/pdf-export.service';
import { ExcelExportService } from '../../../../core/services/excel-export.service';
// Subcomponentes
import { SolicitacoesHeaderComponent } from './header/solicitacoes-header.component';
import { SolicitacoesFiltrosComponent } from './header/solicitacoes-filtros.component';
import { SolicitacoesTabelaComponent } from './solicitacoes-tabela.component';
import { CustomPaginatorComponent } from '../../../../core/components/custom-paginator/custom-paginator.component';
import { SolicitacaoDialogComponent } from './dialogs/solicitacao-dialog.component';
import { SolicitacaoEditDialogComponent } from './dialogs/solicitacacao-edit-dialog.component';
import { SolicitacaoDeleteDialogComponent } from './dialogs/solicitacao-del-dialog.component';
import { SolicitacaoViewDialogComponent } from './dialogs/solicitacao-view-dialog.component';

@Component({
  selector: 'app-solicitacoes-table',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SolicitacoesHeaderComponent,
    SolicitacoesFiltrosComponent,
    SolicitacoesTabelaComponent,
    CustomPaginatorComponent
  ],
  template: `
  <div class="card shadow-sm" [ngClass]="{'dark-card-box': theme.isDarkMode()}">
    <div class="card-body" [ngStyle]="theme.isDarkMode() ? {'background-color': 'transparent'} : {}">

      <app-solicitacoes-header
        (novo)="abrirDialog()"
        (exportarPDF)="exportarPDF()"
        (exportarExcel)="exportarExcel()">
      </app-solicitacoes-header>

      <app-solicitacoes-filtros
        (statusChange)="filterStatus($event)"
        (cidadeChange)="filterCidade($event)"
        (tipoChange)="filterTipo($event)"
        (delegaciaChange)="filterDelegacia($event)"
        (protocoloChange)="filterProtocolo($event)"
        (responsavelChange)="filterResponsavel($event)"
        (observacoesChange)="filterObservacoes($event)">
      </app-solicitacoes-filtros>

      <app-solicitacoes-tabela
        [columns]="columns"
        [displayedColumns]="displayedColumns"
        [data]="pagedSolicitacoes"
        (visualizar)="visualizar($event)"
        (editar)="editar($event)"
        (deletar)="deletar($event)">
      </app-solicitacoes-tabela>

      <app-custom-paginator
  [totalItems]="totalItems"
  [pageSize]="pageSize"
  [(currentPage)]="currentPage"
  (currentPageChange)="updatePagedSolicitacoes($event)">
</app-custom-paginator>


    </div>
  </div>
  `,
  styles: [`
    .dark-card-box { background-color: #222324; color: #fff; }
    .dark-card-box .card-body { background-color: transparent; }
  `]
})
export class SolicitacoesTableComponent implements OnInit {

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'data', label: 'Data' },
    { key: 'hora', label: 'Hora' },
    { key: 'status', label: 'Status' },
    { key: 'delegacia', label: 'Delegacia' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'tipo_ocorrencia', label: 'Tipo' },
    { key: 'numero_protocolo', label: 'Protocolo' },
    { key: 'perito_responsavel', label: 'Responsável' },
    { key: 'observacoes', label: 'Observações' },
  ];
  displayedColumns: string[] = [...this.columns.map(c => c.key), 'acoes'];

  allSolicitacoes: any[] = [];   // Todos os dados completos
  solicitacoes: any[] = [];      // Página atual
  pagedSolicitacoes: any[] = []; // Página filtrada e paginada
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;

  // filtros
  statusFilter = '';
  tipoFilter = '';
  delegaciaFilter = '';
  protocoloFilter = '';
  responsavelFilter = '';
  observacoesFilter = '';
  cidadeFilter: string[] = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    public theme: ThemeService,
    private cdr: ChangeDetectorRef,
    private pdfService: PdfExportService,
    private excelService: ExcelExportService
  ) {}

  ngOnInit() {
    this.loadAllSolicitacoes();
  }

  // Carrega **todos** os dados (para filtros frontend)
  private loadAllSolicitacoes(page: number = 1) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const params: any = { page: page.toString(), per_page: '1000' }; // número grande para pegar tudo
    if (this.statusFilter) params.status = this.statusFilter;
    if (this.cidadeFilter?.length) params.cidade = this.cidadeFilter.join(',');

    this.http.get<any>(`${environment.apiUrl}/solicitacoes`, { headers, params }).subscribe(
      res => {
        this.allSolicitacoes = res.solicitacoes || [];
        this.totalItems = this.allSolicitacoes.length;
        this.currentPage = 1;
        this.applyFiltersAndPaginate();
      },
      err => console.error('Erro ao carregar solicitações', err)
    );
  }

  private applyFiltersAndPaginate() {
    // aplica filtros frontend
    const filtered = this.allSolicitacoes
      .filter(s => !this.tipoFilter || s.tipo_ocorrencia?.toLowerCase().includes(this.tipoFilter.toLowerCase()))
      .filter(s => !this.delegaciaFilter || s.delegacia?.toLowerCase().includes(this.delegaciaFilter.toLowerCase()))
      .filter(s => !this.protocoloFilter || s.numero_protocolo?.toLowerCase().includes(this.protocoloFilter.toLowerCase()))
      .filter(s => !this.responsavelFilter || s.perito_responsavel?.toLowerCase().includes(this.responsavelFilter.toLowerCase()))
      .filter(s => !this.observacoesFilter || s.observacoes?.toLowerCase().includes(this.observacoesFilter.toLowerCase()));

    this.totalItems = filtered.length;

    // paginação
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedSolicitacoes = filtered.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }

  updatePagedSolicitacoes(page: number) {
    this.currentPage = page;
    this.applyFiltersAndPaginate();
  }

  // filtros individuais
  filterStatus(value: string) { this.statusFilter = value; this.loadAllSolicitacoes(); }
  filterCidade(value: string) { this.cidadeFilter = value ? [value] : []; this.loadAllSolicitacoes(); }
  filterTipo(value: string) { this.tipoFilter = value; this.currentPage = 1; this.applyFiltersAndPaginate(); }
  filterDelegacia(value: string) { this.delegaciaFilter = value; this.currentPage = 1; this.applyFiltersAndPaginate(); }
  filterProtocolo(value: string) { this.protocoloFilter = value; this.currentPage = 1; this.applyFiltersAndPaginate(); }
  filterResponsavel(value: string) { this.responsavelFilter = value; this.currentPage = 1; this.applyFiltersAndPaginate(); }
  filterObservacoes(value: string) { this.observacoesFilter = value; this.currentPage = 1; this.applyFiltersAndPaginate(); }

  // ações
  editar(s: any) { 
    this.dialog.open(SolicitacaoEditDialogComponent, { width: '450px', data: s })
      .afterClosed().subscribe(result => { if (result) this.loadAllSolicitacoes(); });
  }

  deletar(s: any) { 
    this.dialog.open(SolicitacaoDeleteDialogComponent, { width: '450px', data: s })
      .afterClosed().subscribe(result => { if (result) this.loadAllSolicitacoes(); });
  }

  visualizar(s: any) { 
    this.dialog.open(SolicitacaoViewDialogComponent, { width: '550px', data: s }).afterClosed().subscribe(); 
  }

  abrirDialog() { 
    this.dialog.open(SolicitacaoDialogComponent, { width: '450px' })
      .afterClosed().subscribe(result => { if (result) this.loadAllSolicitacoes(); });
  }

  exportarPDF() {
    this.pdfService.exportTable(this.columns, this.allSolicitacoes, 'Solicitações', 'Relatório de solicitações');
  }
  
  exportarExcel() {
    this.excelService.exportXLSM(this.allSolicitacoes, 'Solicitações');
  }
}
