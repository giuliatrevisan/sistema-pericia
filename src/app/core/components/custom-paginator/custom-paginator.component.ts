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
      <button mat-icon-button (click)="prevPage()" [disabled]="currentPage === 1">
        <mat-icon>chevron_left</mat-icon>
      </button>

      <ng-container *ngFor="let page of allPages()">
        <button class="bubble" [class.active]="currentPage === page" (click)="goToPage(page)">
          {{ page }}
        </button>
      </ng-container>

      <button mat-icon-button (click)="nextPage()" [disabled]="currentPage === totalPages">
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .custom-paginator {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
      padding: 8px 0;
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
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
  }

  allPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.currentPageChange.emit(this.currentPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
  }
}
