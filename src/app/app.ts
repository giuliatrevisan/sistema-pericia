// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
   <!-- // <h1>{{ title }}</h1> -->
    <router-outlet></router-outlet>
  `
})
export class App {
//  title = 'sistema-pericias-dashboard'; // adiciona a propriedade
}
