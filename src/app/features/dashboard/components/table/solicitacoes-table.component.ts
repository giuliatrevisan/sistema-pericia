import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../../../core/services/theme.service';
import { environment } from '../../../../environments/environments';

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
        (novo)="abrirDialog()">
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
        [data]="solicitacoes"
        (visualizar)="visualizar($event)"
        (editar)="editar($event)"
        (deletar)="deletar($event)">
      </app-solicitacoes-tabela>

      <app-custom-paginator
        [totalItems]="totalItems"
        [pageSize]="pageSize"
        [(currentPage)]="currentPage"
        (currentPageChange)="carregarSolicitacoes($event)">
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

  solicitacoes: any[] = [];
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarSolicitacoes(this.currentPage);
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
        this.solicitacoes = res.solicitacoes || [];
        this.totalItems = res.pagination?.total || 0;
        this.currentPage = res.pagination?.page || 1;
        this.pageSize = res.pagination?.per_page || 10;
        this.cdr.detectChanges();
      },
      err => console.error('Erro ao carregar solicitações', err)
    );
  }

  // filtros individuais
  filterStatus(value: string) { this.statusFilter = value; this.carregarSolicitacoes(1); }
  filterCidade(value: string) { this.cidadeFilter = value ? [value] : []; this.carregarSolicitacoes(1); }
  filterTipo(value: string) { this.tipoFilter = value; this.carregarSolicitacoes(1); }
  filterDelegacia(value: string) { this.delegaciaFilter = value; this.carregarSolicitacoes(1); }
  filterProtocolo(value: string) { this.protocoloFilter = value; this.carregarSolicitacoes(1); }
  filterResponsavel(value: string) { this.responsavelFilter = value; this.carregarSolicitacoes(1); }
  filterObservacoes(value: string) { this.observacoesFilter = value; this.carregarSolicitacoes(1); }

  // ações
  editar(s: any) { 
    this.dialog.open(SolicitacaoEditDialogComponent, { width: '450px', data: s })
      .afterClosed().subscribe(result => { if (result) this.carregarSolicitacoes(this.currentPage); });
  }

  deletar(s: any) { 
    this.dialog.open(SolicitacaoDeleteDialogComponent, { width: '450px', data: s })
      .afterClosed().subscribe(result => { if (result) this.carregarSolicitacoes(this.currentPage); });
  }

  visualizar(s: any) { 
    this.dialog.open(SolicitacaoViewDialogComponent, { width: '550px', data: s }).afterClosed().subscribe(); 
  }

  abrirDialog() { 
    this.dialog.open(SolicitacaoDialogComponent, { width: '450px' })
      .afterClosed().subscribe(result => { if (result) this.carregarSolicitacoes(1); });
  }
}
