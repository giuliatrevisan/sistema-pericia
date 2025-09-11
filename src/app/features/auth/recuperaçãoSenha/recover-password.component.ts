import { Component, signal, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
<div class="recover-wrapper d-flex justify-content-center align-items-center">
  <form [formGroup]="form" (ngSubmit)="submit($event)" class="recover-form text-center p-4">
    
    <div class="form-logo mb-4 d-flex justify-content-center">
      <img src="assets/images/logos/logo-horizontal.png" alt="Logo Perícia Forense" class="img-fluid" />
    </div>

    <h2 class="mb-4">Recuperar Senha</h2>

    <mat-form-field appearance="outline" class="w-100 mb-3">
      <mat-label>E-mail</mat-label>
      <input matInput type="email" formControlName="email" placeholder="Digite seu e-mail" />
    </mat-form-field>

    <button mat-raised-button class="w-100 mb-3 btn-green" [disabled]="loading()">
      {{ loading() ? 'Enviando...' : 'Enviar' }}
    </button>

    <div class="links d-flex justify-content-center gap-3">
      <a [routerLink]="'/login'">Voltar ao Login</a>
    </div>

  </form>
</div>
  `,
  styles: [`
.recover-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: var(--carousel-image);
    background-size: cover;
    background-position: center;
    transition: background-image 1s ease-in-out;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 200%; height: 200%;
    background: rgba(255, 255, 255, 0.03);
    clip-path: ellipse(60% 40% at 50% 100%);
    animation: wave 6s linear infinite;
    z-index: 1;
  }

  @keyframes wave {
    0%   { transform: translateX(0) translateY(0); }
    50%  { transform: translateX(-25%) translateY(15px); }
    100% { transform: translateX(0) translateY(0); }
  }

  .recover-form {
    position: relative;
    z-index: 2;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    max-width: 400px;
    width: 100%;
  }

  .form-logo img {
    max-width: 180px;
  }
}

.btn-green {
  background: linear-gradient(135deg, #00c37a, #009e57);
  color: #fff;
  font-weight: 700;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0, 156, 87, 0.3);
  transition: all 0.3s ease;
}

.btn-green:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 156, 87, 0.4);
  background: linear-gradient(135deg, #00d38f, #00a75f);
}
  `]
})
export class RecoverPasswordComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  images = [
    'assets/images/carousel/img1.png',
    'assets/images/carousel/img2.png',
    'assets/images/carousel/img3.png'
  ];
  currentImage = signal(0);

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private el: ElementRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.updateBackground();
    setInterval(() => {
      this.currentImage.set((this.currentImage() + 1) % this.images.length);
      this.updateBackground();
    }, 5000);
  }

  updateBackground() {
    const wrapper = this.el.nativeElement.querySelector('.recover-wrapper');
    if (wrapper) {
      const url = `url('${this.images[this.currentImage()]}')`;
      wrapper.style.setProperty('--carousel-image', url);
    }
  }

  submit(event?: Event) {
    event?.preventDefault();
    if (this.form.invalid) return;

    this.loading.set(true);

    // Simula envio de e-mail
    setTimeout(() => {
        console.log('Enviando snackbar'); // teste
        this.loading.set(false);
        this.snackBar.open('E-mail enviado! Verifique sua caixa de entrada com os próximos passos.', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.form.reset();
      }, 1000);
      
  }
}
