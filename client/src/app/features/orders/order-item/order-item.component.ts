import { Component, Input, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Order, OrderStatus } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent {
  @Input({ required: true }) order!: Order;

  private readonly orderSignal = signal<Order | null>(null);

  readonly statusConfig = computed(() => {
    const order = this.orderSignal();
    if (!order) return this.getDefaultStatusConfig();
    
    const statusMap: Record<OrderStatus, { label: string; icon: string; class: string }> = {
      [OrderStatus.PENDING]: { label: 'Pendiente', icon: 'schedule', class: 'status-pending' },
      [OrderStatus.PROCESSING]: { label: 'Procesando', icon: 'sync', class: 'status-processing' },
      [OrderStatus.PROCESSED]: { label: 'Procesada', icon: 'check_circle', class: 'status-processed' },
      [OrderStatus.DELIVERED]: { label: 'Entregada', icon: 'local_shipping', class: 'status-delivered' },
      [OrderStatus.CANCELLED]: { label: 'Cancelada', icon: 'cancel', class: 'status-cancelled' }
    };
    
    return statusMap[order.status] || this.getDefaultStatusConfig();
  });

  readonly formattedDate = computed(() => {
    const order = this.orderSignal();
    if (!order) return '';
    
    const date = new Date(order.updatedAt);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  });

  readonly timeAgo = computed(() => {
    const order = this.orderSignal();
    if (!order) return '';
    
    const now = new Date().getTime();
    const orderTime = new Date(order.updatedAt).getTime();
    const diffMs = now - orderTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} días`;
  });

  readonly isRecent = computed(() => {
    const order = this.orderSignal();
    if (!order) return false;
    
    const now = new Date().getTime();
    const orderTime = new Date(order.updatedAt).getTime();
    const diffMs = now - orderTime;
    return diffMs < 300000;
  });

  ngOnChanges(): void {
    if (this.order) {
      this.orderSignal.set(this.order);
    }
  }

  private getDefaultStatusConfig(): { label: string; icon: string; class: string } {
    return { label: 'Desconocido', icon: 'help', class: 'status-unknown' };
  }

  onRetry(): void {
    console.log(`Reintentando orden: ${this.order?.id}`);
  }

  onViewDetails(): void {
    console.log(`Ver detalles de orden: ${this.order?.id}`);
  }
}