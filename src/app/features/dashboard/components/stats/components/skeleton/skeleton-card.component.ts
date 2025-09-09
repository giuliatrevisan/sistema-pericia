import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-card"
         [ngStyle]="{
           'width': width,
           'height': height,
           'border-radius': borderRadius
         }">
    </div>
  `,
  styles: [`
    .skeleton-card {
      background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.2s infinite;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `]
})
export class SkeletonCardComponent {
  @Input() width: string = '100%';
  @Input() height: string = '100px';
  @Input() borderRadius: string = '8px';
}
