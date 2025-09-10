import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../../core/interceptors/auth.service';
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
        [data]="dataSource.filteredData"
        (visualizar)="visualizar($event)"
        (editar)="editar($event)"
        (deletar)="deletar($event)">
      </app-solicitacoes-tabela>

      <app-custom-paginator
        [totalItems]="totalItems"
        [pageSize]="pageSize"
        [(currentPage)]="currentPage"
        (currentPageChange)="onPageChange($event)">
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

  dataSource = new MatTableDataSource<any>([]);
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
    private auth: AuthService,
    private dialog: MatDialog,
    public theme: ThemeService,
    private cdr: ChangeDetectorRef,
    private pdfService: PdfExportService,
    private excelService: ExcelExportService
  ) {}

  ngOnInit() {
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.carregarSolicitacoes();
  }

  private customFilterPredicate(data: any, filter: string) {
    let f: any;
    try { f = JSON.parse(filter); } catch { f = {}; }

    return (
      (!f.status || data.status === f.status) &&
      (!f.cidade || f.cidade.length === 0 || f.cidade.map((c:any)=>c.toLowerCase()).includes(data.cidade?.toLowerCase())) &&
      (!f.tipo || data.tipo_ocorrencia?.toLowerCase().includes(f.tipo.toLowerCase())) &&
      (!f.delegacia || data.delegacia?.toLowerCase().includes(f.delegacia.toLowerCase())) &&
      (!f.protocolo || data.numero_protocolo?.toLowerCase().includes(f.protocolo.toLowerCase())) &&
      (!f.responsavel || data.perito_responsavel?.toLowerCase().includes(f.responsavel.toLowerCase())) &&
      (!f.observacoes || data.observacoes?.toLowerCase().includes(f.observacoes.toLowerCase()))
    );
  }

  updateFilter() {
    const filterObj = {
      status: this.statusFilter,
      cidade: this.cidadeFilter,
      tipo: this.tipoFilter,
      delegacia: this.delegaciaFilter,
      protocolo: this.protocoloFilter,
      responsavel: this.responsavelFilter,
      observacoes: this.observacoesFilter
    };
    this.dataSource.filter = JSON.stringify(filterObj);
    this.totalItems = this.dataSource.filteredData.length;
    this.currentPage = 1;
  }

  carregarSolicitacoes(page: number = 1) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const params: any = { page: page.toString(), per_page: this.pageSize.toString() };

    if (this.statusFilter) params.status = this.statusFilter;
    if (this.tipoFilter) params.tipo = this.tipoFilter;
    if (this.delegaciaFilter) params.delegacia = this.delegaciaFilter;
    if (this.protocoloFilter) params.protocolo = this.protocoloFilter;
    if (this.responsavelFilter) params.responsavel = this.responsavelFilter;
    if (this.observacoesFilter) params.observacoes = this.observacoesFilter;
    if (this.cidadeFilter?.length) params.cidade = this.cidadeFilter.join(',');

    this.http.get<any>(`${environment.apiUrl}/solicitacoes`, { headers, params }).subscribe(
      res => {
        setTimeout(() => {
          this.dataSource.data = res.solicitacoes || [];
          this.totalItems = res.pagination?.total || 0;
          this.currentPage = res.pagination?.page || 1;
          this.updateFilter();
          this.cdr.detectChanges();
        });
      },
      err => console.error('Erro ao carregar solicitações', err)
    );
    
  }

  onPageChange(page: number) { this.carregarSolicitacoes(page); }

  // filtros individuais
  filterStatus(value: string) { this.statusFilter = value; this.updateFilter(); }
  filterCidade(value: string) { this.cidadeFilter = value ? [value] : []; this.updateFilter(); }
  filterTipo(value: string) { this.tipoFilter = value; this.updateFilter(); }
  filterDelegacia(value: string) { this.delegaciaFilter = value; this.updateFilter(); }
  filterProtocolo(value: string) { this.protocoloFilter = value; this.updateFilter(); }
  filterResponsavel(value: string) { this.responsavelFilter = value; this.updateFilter(); }
  filterObservacoes(value: string) { this.observacoesFilter = value; this.updateFilter(); }

  // ações
  editar(s: any) { this.dialog.open(SolicitacaoEditDialogComponent, { width: '450px', data: s })
    .afterClosed().subscribe(result => { if (result) this.carregarSolicitacoes(); });
  }

  deletar(s: any) { this.dialog.open(SolicitacaoDeleteDialogComponent, { width: '450px', data: s })
    .afterClosed().subscribe(result => { if (result) this.carregarSolicitacoes(this.currentPage); });
  }

  visualizar(s: any) { this.dialog.open(SolicitacaoViewDialogComponent, { width: '550px', data: s }).afterClosed().subscribe(); }

  abrirDialog() { this.dialog.open(SolicitacaoDialogComponent, { width: '450px' })
    .afterClosed().subscribe(result => { if (result) this.carregarSolicitacoes(); });
  }

  exportarPDF() { this.pdfService.exportTable(this.columns, this.dataSource.filteredData, 'Solicitações'); }
  exportarExcel() { this.excelService.exportXLSM(this.dataSource.filteredData, 'Solicitacoes'); }


}
