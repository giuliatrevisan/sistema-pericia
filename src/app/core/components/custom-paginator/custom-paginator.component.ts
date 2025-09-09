import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
 <div class="custom-paginator">

<!-- Botão anterior -->
<button mat-icon-button (click)="prevPage()" [disabled]="currentPage === 1">
  <mat-icon>chevron_left</mat-icon>
</button>

<!-- Página 1 -->
<button class="bubble" 
        [class.active]="currentPage === 1"
        (click)="goToPage(1)">1</button>

<!-- Elipse inicial -->
<span *ngIf="showStartEllipsis()">...</span>

<!-- Páginas do meio -->
<ng-container *ngFor="let page of middlePages()">
  <button class="bubble" 
          [class.active]="currentPage === page"
          (click)="goToPage(page)">
    {{ page }}
  </button>
</ng-container>

<!-- Elipse final -->
<span *ngIf="showEndEllipsis()">...</span>

<!-- Última página -->
<button *ngIf="totalPages > 1"
        class="bubble"
        [class.active]="currentPage === totalPages"
        (click)="goToPage(totalPages)">
  {{ totalPages }}
</button>

<!-- Botão próximo -->
<button mat-icon-button (click)="nextPage()" [disabled]="currentPage === totalPages">
  <mat-icon>chevron_right</mat-icon>
</button>

</div>
  `,
  styles: [`
    .custom-paginator {
      display: flex;
      justify-content: center; /* centraliza horizontalmente */
      align-items: center;
      gap: 4px;
      flex-wrap: wrap; /* garante que quebre linha em telas pequenas */
      padding: 8px 0; /* espaço acima e abaixo */
    }

    .bubble {
      min-width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background-color: #f0f0f0;
      cursor: pointer;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
    }

    .bubble.active {
      background-color: #00b894;
      color: #fff;
      font-weight: 600;
      box-shadow: 0 0 5px rgba(0,0,0,0.2);
    }

    .bubble:hover {
      background-color: #00d39c;
      color: #fff;
    }

    button[mat-icon-button] mat-icon {
      color: #00b894;
    }

    button[mat-icon-button]:hover mat-icon {
      color: #00d39c;
    }
  `]
})
export class CustomPaginatorComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Output() currentPageChange = new EventEmitter<number>();

  totalPages: number = 0;

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.currentPageChange.emit(this.currentPage);
  }
  
  

  prevPage() { if (this.currentPage > 1) this.goToPage(this.currentPage - 1); }
  nextPage() { if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1); }

  // Páginas visíveis no meio
  middlePages(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= 7) {
      for (let i = 2; i <= this.totalPages - 1; i++) pages.push(i);
    } else {
      let start = this.currentPage - 2;
      let end = this.currentPage + 2;
  
      if (start < 2) { start = 2; end = 5; }
      if (end > this.totalPages - 1) { end = this.totalPages - 1; start = this.totalPages - 4; }
  
      // Garante que as páginas estejam dentro do intervalo válido
      start = Math.max(2, start);
      end = Math.min(this.totalPages - 1, end);
  
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  }
  
  showStartEllipsis(): boolean {
    return this.totalPages > 7 && this.currentPage > 4;
  }

  showEndEllipsis(): boolean {
    return this.totalPages > 7 && this.currentPage < this.totalPages - 3;
  }
}
