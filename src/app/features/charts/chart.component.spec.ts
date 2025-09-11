import { RelatoriosComponent } from './chart.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('RelatoriosComponent (manual)', () => {
  let component: RelatoriosComponent;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new RelatoriosComponent(httpSpy, cdrSpy, { isDarkMode: () => false } as any);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load solicitacoes and generate charts on success', () => {
    const mockData = {
      solicitacoes: [
        { cidade: 'Cidade1', status: 'Aberto', tipo_ocorrencia: 'Tipo1', delegacia: '', perito_responsavel: '', data: '' },
        { cidade: 'Cidade2', status: 'Fechado', tipo_ocorrencia: 'Tipo2', delegacia: '', perito_responsavel: '', data: '' },
        { cidade: 'Cidade1', status: 'Aberto', tipo_ocorrencia: 'Tipo1', delegacia: '', perito_responsavel: '', data: '' }
      ]
    };

    httpSpy.get.and.returnValue(of(mockData));

    component.carregarSolicitacoes();

    expect(component.solicitacoes.length).toBe(3);
    expect(component.charts.length).toBe(3);
    expect(component.loading).toBeFalse();
    expect(cdrSpy.detectChanges).toHaveBeenCalled();
  });

  it('should handle error when loading solicitacoes', () => {
    httpSpy.get.and.returnValue(throwError(() => new Error('Falha')));

    component.carregarSolicitacoes();

    expect(component.solicitacoes.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(cdrSpy.detectChanges).toHaveBeenCalled();
  });

  it('should reorder charts on drop', () => {
    component.charts = [
        { 
          title: 'A', 
          type: 'bar', 
          options: {}, 
          data: { labels: ['X'], datasets: [{ data: [1], label: 'Test', backgroundColor: '#1976d2' }] } 
        },
        { 
          title: 'B', 
          type: 'bar', 
          options: {}, 
          data: { labels: ['Y'], datasets: [{ data: [2], label: 'Test', backgroundColor: '#f44336' }] } 
        }
      ];
      
    component.drop({ previousIndex: 0, currentIndex: 1 } as any);

    expect(component.charts[0].title).toBe('B');
    expect(component.charts[1].title).toBe('A');
  });
});
