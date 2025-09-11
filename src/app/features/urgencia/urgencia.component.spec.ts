import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrgenciaComponent } from './urgencia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ThemeService } from '../../core/services/theme.service';

describe('UrgenciaComponent', () => {
  let component: UrgenciaComponent;

  beforeEach(() => {
    const themeMock = { isDarkMode: () => false };
    const dialogMock = { open: jasmine.createSpy('open') };

    component = new UrgenciaComponent(
      {} as any, // HttpClient
      { detectChanges: () => {} } as any, // ChangeDetectorRef
      themeMock as any,
      dialogMock as any
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading true by default', () => {
    expect(component.loading).toBe(true);
  });

  it('should open dialog without crashing', () => {
    component.solicitacoes = [{ id: 1, titulo: 'Teste', status: 'aberto', prioridade: 1, created_at: '2025-09-11T00:00:00', numero_protocolo: '123', data: '2025-09-11', dataPtBr: '11/09/2025' }];
    component.abrirSolicitacao(component.solicitacoes[0]);
    expect((component as any).dialog.open).toHaveBeenCalled();
  });

  it('should reorder items without crashing', () => {
    const item1 = { id: 1 } as any;
    const item2 = { id: 2 } as any;
    component.solicitacoes = [item1, item2];

    component.drop({ previousIndex: 0, currentIndex: 1 } as any);
    expect(component.solicitacoes[0].id).toBe(2);
    expect(component.solicitacoes[1].id).toBe(1);
  });
});
