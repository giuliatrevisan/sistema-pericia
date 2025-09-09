import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../core/interceptors/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { environment } from '../../environments/environments';
import { PdfExportService } from '../../core/services/pdf-export.service';

// Subcomponentes
import { SolicitacoesHeaderComponent } from './solicitacoes-header.component';
import { SolicitacoesFiltrosComponent } from './solicitacoes-filtros.component';
import { SolicitacoesTabelaComponent } from './solicitacoes-tabela.component';
import { CustomPaginatorComponent } from './custom-paginator.component';
import { SolicitacaoDialogComponent } from './solicitacao-dialog.component';

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

      <!-- Header -->
      <app-solicitacoes-header
        (novo)="abrirDialog()"
        (exportar)="exportarPDF()">
      </app-solicitacoes-header>

      <!-- Filtros -->
      <app-solicitacoes-filtros
        (statusChange)="filterStatus($event)"
        (cidadeChange)="filterCidade($event)"
        (tipoChange)="filterTipo($event)"
        (pesquisa)="applyFilter($event)"
        (periodoChange)="filterPeriodo($event)">
      </app-solicitacoes-filtros>

      <!-- Tabela -->
      <app-solicitacoes-tabela
        [columns]="columns"
        [displayedColumns]="displayedColumns"
        [data]="paginatedData"
        (visualizar)="visualizar($event)"
        (editar)="editar($event)"
        (deletar)="deletar($event)">
      </app-solicitacoes-tabela>

      <!-- Paginador -->
      <app-custom-paginator
        [totalItems]="dataSource.filteredData.length"
        [pageSize]="pageSize"
        [(currentPage)]="currentPage">
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
  currentPage = 1;
  pageSize = 10;

  // filtros
  statusFilter: string = '';
  cidadeFilter: string[] = [];
  tipoFilter: string = '';
  searchFilter: string = '';
  periodoFilter: { start: Date | null, end: Date | null } = { start: null, end: null };

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private dialog: MatDialog,
    public theme: ThemeService,
    private cdr: ChangeDetectorRef,
    private pdfService: PdfExportService
  ) { }

  ngOnInit() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const f = JSON.parse(filter);

      // Filtros simples
      const statusMatch = !f.status || data.status === f.status;
      const cidadeMatch = !f.cidade || f.cidade.length === 0 || f.cidade.includes(data.cidade);
      const tipoMatch = !f.tipo || data.tipo_ocorrencia?.toLowerCase().includes(f.tipo.toLowerCase());
      const searchMatch = !f.search || Object.values(data).join(' ').toLowerCase().includes(f.search.toLowerCase());

      // Função para converter data para formato Date
      const parseDataRegistro = (d: string, h?: string) => {
        if (!d) return null;
        const [dia, mes, ano] = d.split('/').map(Number);
        const date = new Date(ano, mes - 1, dia);
        if (h) {
          const [hh, mm, ss] = h.split(':').map(Number);
          date.setHours(hh || 0, mm || 0, ss || 0, 0);
        } else {
          date.setHours(0, 0, 0, 0);
        }
        return date;
      }

      const dataRegistro = parseDataRegistro(data.data, data.hora);

      let startOk = true, endOk = true;
      let startDate = f.periodo?.start ? new Date(f.periodo.start) : null;
      let endDate = f.periodo?.end ? new Date(f.periodo.end) : null;

      // Ajustando o fuso horário para comparação
      if (dataRegistro) {
        // Garantir que as datas estejam no mesmo fuso horário
        const localStartDate = startDate ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000) : null;
        const localEndDate = endDate ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000) : null;

        if (localStartDate) startOk = dataRegistro >= localStartDate;
        if (localEndDate) endOk = dataRegistro <= localEndDate;
      }

      return statusMatch && cidadeMatch && tipoMatch && searchMatch && startOk && endOk;
    };

    this.carregarSolicitacoes();
  }


  // Atualiza filtro
  updateFilter() {
    const filterObj = {
      status: this.statusFilter,
      cidade: this.cidadeFilter,
      tipo: this.tipoFilter,
      search: this.searchFilter,
      periodo: this.periodoFilter
    };

    console.log("Filtros aplicados:", filterObj); // Verificando os filtros
    this.dataSource.filter = JSON.stringify(filterObj) + Math.random();
  }

  carregarSolicitacoes() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`${environment.apiUrl}/solicitacoes`, { headers })
      .subscribe(res => {
        const solicitacoes = res.solicitacoes || [];
        this.dataSource.data = solicitacoes;

        this.currentPage = 1;

        // Força Angular a atualizar a tabela
        this.cdr.detectChanges();
      }, err => console.error('Erro ao carregar solicitações', err));
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.dataSource.filteredData.slice(start, start + this.pageSize);
  }

  // ===== Filtros =====
  applyFilter(value: string) { this.searchFilter = value; this.updateFilter(); }
  filterStatus(value: string) { this.statusFilter = value; this.updateFilter(); }
  filterCidade(value: string[]) {
    this.cidadeFilter = value;
    this.updateFilter();
  }
  filterTipo(value: string) { this.tipoFilter = value; this.updateFilter(); }

  // ===== Filtros de Período =====
  filterPeriodo(value: { start: Date | null, end: Date | null }) {
    // Garantir que as datas estejam no formato correto
    if (value.start) value.start = new Date(value.start);
    if (value.end) value.end = new Date(value.end);

    this.periodoFilter = value;
    this.updateFilter();
  }

  // ===== Ações =====
  visualizar(s: any) { console.log('Visualizar:', s); }
  editar(s: any) { console.log('Editar:', s); }
  deletar(s: any) { console.log('Deletar:', s); }

  abrirDialog() {
    this.dialog.open(SolicitacaoDialogComponent, { width: '450px' })
      .afterClosed().subscribe((result: boolean) => {
        if (result) this.carregarSolicitacoes();
      });
  }

  exportarPDF() {
    this.pdfService.exportTable(this.columns, this.dataSource.filteredData, 'Solicitações');
  }
}
