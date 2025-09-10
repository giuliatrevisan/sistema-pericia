import { Component, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UsersTabelaComponent } from '../users-tabela.component';
import { UsersHeaderComponent } from './users-header.component';
import { UsersFiltrosComponent } from './header/users-filtros.component';
import { CustomPaginatorComponent } from '../../../../core/components/custom-paginator/custom-paginator.component';
import { UserEditDialogComponent } from './dialogs/user-edit-dialog.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { environment } from '../../../../environments/environments';
@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    UsersTabelaComponent,
    UsersHeaderComponent,
    UsersFiltrosComponent,
    CustomPaginatorComponent
  ],
  template: `
    <div class="card shadow-sm rounded-3"
         [ngClass]="theme.isDarkMode() ? 'bg-dark text-light' : 'bg-white text-dark'">
      <div class="card-body p-3 p-md-4">
        
        <app-users-header></app-users-header>

        <app-users-filtros
          (usernameChange)="filtros.username = $event; updateFilter()"
          (emailChange)="filtros.email = $event; updateFilter()"
          (roleChange)="filtros.role = $event; updateFilter()"
          (ativoChange)="filtros.ativo = $event; updateFilter()">
        </app-users-filtros>

        <div class="table-responsive mt-3">
          <app-users-tabela
            [columns]="columns"
            [displayedColumns]="displayedColumns"
            [data]="pagedData"
            (editar)="abrirDialog($event)">
          </app-users-tabela>
        </div>

        <div class="mt-3">
          <app-custom-paginator
            [totalItems]="totalItems"
            [pageSize]="pageSize"
            [(currentPage)]="currentPage"
            (currentPageChange)="onPageChange($event)">
          </app-custom-paginator>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .table-responsive { overflow-x: auto; }
    @media (max-width: 768px) { .card { margin: 0.5rem auto; max-width: 95%; border-radius: 4px; } .card-body { padding: 0.5rem 0.75rem; font-size: 0.875rem; width:300px; } .table-wrapper { -webkit-overflow-scrolling: touch; } }
  `]
})
export class UsersTableComponent implements OnChanges {
  @Input() users: any[] = [];

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Usuário' },
    { key: 'email', label: 'Email' },
    { key: 'roles', label: 'Funções' },
    { key: 'active', label: 'Ativo' }
  ];
  displayedColumns: string[] = [...this.columns.map(c => c.key), 'acoes'];

  filtros = { username: '', email: '', role: '', ativo: '' };
  filteredData: any[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public theme: ThemeService
  ) { }

  ngOnChanges() { this.applyFilters(); }

  applyFilters() {
    this.filteredData = (this.users || []).filter(user =>
      (!this.filtros.username || user.username?.toLowerCase().includes(this.filtros.username.toLowerCase())) &&
      (!this.filtros.email || user.email?.toLowerCase().includes(this.filtros.email.toLowerCase())) &&
      (!this.filtros.role || (user.roles || []).map((r: any) => r.toLowerCase()).includes(this.filtros.role.toLowerCase())) &&
      (!this.filtros.ativo || String(user.active) === this.filtros.ativo)
    );
    this.totalItems = this.filteredData.length;
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  get pagedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  updateFilter() { this.applyFilters(); }
  onPageChange(page: number) { this.currentPage = page; }

  abrirDialog(user: any) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, { width: '450px', data: { ...user } });
    dialogRef.afterClosed().subscribe(result => { if (result) this.applyFilters(); });
  }
}
