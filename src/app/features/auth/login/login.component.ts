import { Component, signal, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/interceptors/auth.service';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  error = signal('');

  images = [
    'assets/images/carousel/img1.png',
    'assets/images/carousel/img2.png',
    'assets/images/carousel/img3.png'
  ];
  currentImage = signal(0);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Inicializa o background
    this.updateBackground();

    setInterval(() => {
      this.currentImage.set((this.currentImage() + 1) % this.images.length);
      this.updateBackground();
    }, 5000);
  }

  updateBackground() {
    const wrapper = this.el.nativeElement.querySelector('.login-wrapper');
    if (wrapper) {
      const url = `url('${this.images[this.currentImage()]}')`;
      wrapper.style.setProperty('--carousel-image', url); // <-- usar setProperty
    }
  }
  
  

  submit(event?: Event) {
    event?.preventDefault();
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    const { username, password } = this.form.value;

    this.auth.login(username, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err: Error) => this.error.set(err.message)
      });
  }
}
