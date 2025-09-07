import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/interceptors/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  message = signal('');

  images = [
    'assets/images/carousel/img1.png',
    'assets/images/carousel/img2.png',
    'assets/images/carousel/img3.png'
  ];
  currentImage = signal(0);

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }
  ngOnInit() {
    this.updateBackground();
    setInterval(() => {
      this.currentImage.set((this.currentImage() + 1) % this.images.length);
      this.updateBackground();
    }, 5000);
  }

  updateBackground() {
    const wrapper = document.querySelector('.register-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.style.setProperty('--carousel-image', `url('${this.images[this.currentImage()]}')`);
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.message.set('');

    const { username, email, password } = this.form.value;

    this.auth.register(username, email, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.message.set('Registro realizado com sucesso!'),
        error: (err: Error) => this.error.set(err.message)
      });
  }
}
