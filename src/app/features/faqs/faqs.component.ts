import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThemeService } from '../../core/services/theme.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Faq {
  pergunta: string;
  resposta: string;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    HttpClientModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  template: `
<div class="dashboard-layout d-flex min-vh-100"
[ngStyle]="{'background-image': theme.isDarkMode() ? 'var(--background-image-dark)' : 'var(--background-image-light)'}"

>
  <app-sidebar></app-sidebar>

  <div class="main-content flex-grow-1">
    <app-navbar class="sticky-top bg-light shadow-sm"></app-navbar>

    <div class="content p-3">
      <h2>FAQ - Perguntas Frequentes</h2>

      <!-- Descrição -->
      <div [ngClass]="theme.isDarkMode() ? 'faq-desc-dark' : 'faq-desc-light'" style="margin-bottom: 1.5rem;">
        <p class="mb-0">
          Encontre respostas rápidas para dúvidas comuns. Se não encontrar a resposta que procura, utilize o formulário ao lado para enviar sua pergunta.
        </p>
      </div>

      <ng-container *ngIf="loading; else faqTemplate">
        <div class="d-flex justify-content-center align-items-center" style="height:200px">
          <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
        </div>
      </ng-container>

      <ng-template #faqTemplate>
        <div class="row g-3">
          <!-- Perguntas Frequentes -->
          <div class="col-12 col-md-6">
            <div [ngClass]="theme.isDarkMode() ? 'faq-accordion-dark' : ''">
              <mat-accordion>
                <mat-expansion-panel *ngFor="let faq of faqs">
                  <mat-expansion-panel-header>
                    <!-- Título com overlay -->
                    <div class="faq-panel-title-overlay" [ngClass]="theme.isDarkMode() ? 'dark' : 'light'">
                      {{ faq.pergunta }}
                    </div>
                  </mat-expansion-panel-header>
                  <!-- Resposta -->
                  <p [ngClass]="theme.isDarkMode() ? 'faq-answer-dark' : 'faq-answer-light'">{{ faq.resposta }}</p>
                </mat-expansion-panel>
              </mat-accordion>
            </div>
          </div>

          <!-- Formulário de Dúvida -->
          <div class="col-12 col-md-6">
            <div [ngClass]="theme.isDarkMode() ? 'faq-form-dark' : 'faq-form-light'">
              <h5>Envie sua dúvida</h5>
              <form (ngSubmit)="enviarDuvida()" #duvidaForm="ngForm">
                <mat-form-field appearance="fill" class="w-100 mb-2">
                  <mat-label>Assunto</mat-label>
                  <input matInput required [(ngModel)]="duvida.assunto" name="assunto">
                </mat-form-field>

                <mat-form-field appearance="fill" class="w-100 mb-2">
                  <mat-label>Mensagem</mat-label>
                  <textarea matInput required [(ngModel)]="duvida.mensagem" name="mensagem" rows="5"></textarea>
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit">Enviar</button>
              </form>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  </div>
</div>
  `,
  styles: [`
.main-content { margin-left: 250px; }
@media (max-width:767.98px) { .main-content { margin-left:0; } }
.content { margin-top: 60px; overflow-y:auto; min-height:calc(100vh - 60px); }

.mat-form-field { width: 100%; }

.dashboard-layout {
  min-height: 100vh; /* ocupa toda a altura */
  width: 100%;
  background-image: var(--background-image-light);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.3s ease, background-color 0.3s ease;
}

/* Dark mode */
body.dark-mode .dashboard-layout {
  background-image: var(--background-image-dark);
}

/* Toast custom */
.toast-light { background-color: #ffffff; color: #000; }
.toast-dark { background-color: #424242; color: #fff; }

/* Estilização divs */
.faq-desc-light, .faq-form-light {
  background-color: #ffffff;
  color: #000;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.faq-desc-dark, .faq-form-dark {
  background-color: #2c2c2c;
  color: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

/* Dark mode para Mat Expansion Panel */
.faq-accordion-dark .mat-expansion-panel {
  background-color: #2c2c2c !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  border-radius: 0.75rem;
}

/* Cabeçalho painel */
.faq-accordion-dark .mat-expansion-panel-header {
  background-color: #2c2c2c !important;
}

/* Overlay título */
.faq-panel-title-overlay {
  position: relative;
  font-size: 16px;
  font-weight: 500;
  z-index: 2;
  pointer-events: none;
}
.faq-panel-title-overlay.light { color: #000; }
.faq-panel-title-overlay.dark { color: #fff; }

/* Resposta */
.faq-answer-light { color: #000; }
.faq-answer-dark { color: #fff; }

/* Cabeçalho expandido */
.faq-accordion-dark ::ng-deep .mat-expansion-panel-header.mat-expanded {
  background-color: #2c2c2c !important;
}

/* Ícone expand/collapse */
.faq-accordion-dark ::ng-deep .mat-expansion-indicator {
  color: #fff !important;
}
  `]
})
export class FaqsComponent implements OnInit {
  loading = true;
  faqs: Faq[] = [];
  duvida = { assunto: '', mensagem: '' };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public theme: ThemeService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.faqs = [
        { pergunta: 'Como criar uma conta?', resposta: 'Você pode criar uma conta clicando no botão de cadastro na página inicial.' },
        { pergunta: 'Esqueci minha senha', resposta: 'Clique em "Esqueci minha senha" na tela de login e siga as instruções.' },
        { pergunta: 'Como alterar meu perfil?', resposta: 'Acesse a tela de perfil e clique em "Editar" para alterar suas informações.' },
        { pergunta: 'Como enviar uma solicitação?', resposta: 'Vá até a tela de solicitações e clique em "Nova Solicitação".' }
      ];
      this.loading = false;
      this.cdr.detectChanges();
    }, 800);
  }

  enviarDuvida() {
    if (!this.duvida.assunto || !this.duvida.mensagem) return;

    if (isPlatformBrowser(this.platformId)) {
      this.snackBar.open(`Dúvida enviada!`, 'Fechar', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: this.theme.isDarkMode() ? 'toast-dark' : 'toast-light'
      });
    }

    this.duvida.assunto = '';
    this.duvida.mensagem = '';
  }
}
