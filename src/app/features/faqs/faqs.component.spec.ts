import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

interface Faq {
  pergunta: string;
  resposta: string;
}

@Component({
    selector: 'app-faqs',
    standalone: true,
    imports: [FormsModule],
  template: `
    <div class="faq-container">
      <h2>FAQ - Perguntas Frequentes</h2>

      <div *ngIf="loading">Carregando...</div>

      <div *ngIf="!loading">
        <div *ngFor="let faq of faqs" class="faq-item">
          <strong>{{ faq.pergunta }}</strong>
          <p>{{ faq.resposta }}</p>
        </div>

        <div class="faq-form">
          <h4>Envie sua dúvida</h4>
          <input placeholder="Assunto" [(ngModel)]="duvida.assunto" />
          <textarea placeholder="Mensagem" [(ngModel)]="duvida.mensagem"></textarea>
          <button (click)="enviarDuvida()">Enviar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .faq-container { padding: 2rem; font-family: Arial, sans-serif; }
    .faq-item { margin-bottom: 1rem; }
    .faq-form { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.5rem; max-width: 400px; }
    input, textarea { padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
    button { padding: 0.5rem; background-color: #0f4c75; color: white; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class FaqsComponent implements OnInit {
  loading = true;
  faqs: Faq[] = [];
  duvida = { assunto: '', mensagem: '' };

  ngOnInit() {
    // Simula carregamento de FAQs
    setTimeout(() => {
      this.faqs = [
        { pergunta: 'Como criar uma conta?', resposta: 'Apenas o usuário ADMIN pode criar contas.' },
        { pergunta: 'Esqueci minha senha', resposta: 'Use a opção "Esqueci minha senha" na tela de login.' },
        { pergunta: 'Como alterar meu perfil?', resposta: 'Acesse o perfil e clique em "Editar".' },
        { pergunta: 'Como enviar uma solicitação?', resposta: 'Vá até a tela de solicitações e clique em "Nova Solicitação".' }
      ];
      this.loading = false;
    }, 500);
  }

  enviarDuvida() {
    if (!this.duvida.assunto || !this.duvida.mensagem) return;

    alert(`Dúvida enviada!\nAssunto: ${this.duvida.assunto}\nMensagem: ${this.duvida.mensagem}`);
    this.duvida.assunto = '';
    this.duvida.mensagem = '';
  }
}
