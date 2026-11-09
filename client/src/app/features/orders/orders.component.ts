import { Component, OnInit, OnDestroy, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderEventService } from '../../core/services/order-event.service';
import { Order, OrderStatus } from '../../shared/models/order.model';
import { OrderItemComponent } from './order-item/order-item.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
    OrderItemComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderEventService);
  private snackBar = inject(MatSnackBar);

  orders = this.orderService.ordersSignal;
  isConnected = this.orderService.isConnected;
  
  pendingCount = computed(() => 
    this.orders().filter(o => o.status === OrderStatus.PENDING).length
  );

  processedCount = computed(() => 
    this.orders().filter(o => o.status === OrderStatus.PROCESSED).length
  );

  deliveredCount = computed(() => 
    this.orders().filter(o => o.status === OrderStatus.DELIVERED).length
  );

  totalRevenue = computed(() => 
    this.orders()
      .filter(o => o.status === OrderStatus.DELIVERED)
      .reduce((sum, order) => sum + (order.total || 0), 0)
  );

  lastUpdate = signal<Date | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentOrders = this.orders();
      if (currentOrders.length > 0) {
        this.lastUpdate.set(new Date());
        this.isLoading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.initializeConnection();
  }

  ngOnDestroy(): void {
    this.orderService.disconnect();
  }

  private initializeConnection(): void {
    try {
      this.orderService.setupEventSource();
      this.isLoading.set(false);
      this.showNotification('Conectado al stream de pedidos');
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  private handleConnectionError(error: unknown): void {
    this.isLoading.set(false);
    const message = error instanceof Error ? error.message : 'Error de conexión';
    this.errorMessage.set(message);
    this.showNotification(message, 'error');
  }

  reconnect(): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);
    this.orderService.disconnect();
    setTimeout(() => this.initializeConnection(), 1000);
  }

  refreshOrders(): void {
    this.isLoading.set(true);
    this.orderService.disconnect();
    setTimeout(() => {
      this.orderService.setupEventSource();
      this.isLoading.set(false);
      this.showNotification('Pedidos actualizados');
    }, 500);
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success']
    });
  }

  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: '#f59e0b',
      [OrderStatus.PROCESSED]: '#3b82f6',
      [OrderStatus.DELIVERED]: '#10b981'
    };
    return colors[status] || '#6b7280';
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}