import { Injectable, signal } from '@angular/core';
import { OrderEventDTO, Order } from '../../shared/models/order.model';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private eventSource!: EventSource;
  private ordersSignal = signal<Order[]>([]);
  private eventSubject = new ReplaySubject<OrderEventDTO>(1);
  private isConnected = false;

  constructor() {
    this.setupEventSource();
  }

  get orders$(): Observable<Order[]> {
    return this.ordersSignal.asObservable();
  }

  get orderEvents$(): Observable<OrderEventDTO> {
    return this.eventSubject.asObservable();
  }

  getOrders(): Order[] {
    return this.ordersSignal();
  }

  private setupEventSource(): void {
    if (this.isConnected) return;

    this.eventSource = new EventSource(`${environment.apiUrl}/orders/stream`);

    this.eventSource.onopen = () => {
      this.isConnected = true;
      console.log('SSE connection established');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data: OrderEventDTO = JSON.parse(event.data);
        const order = Order.fromEventDTO(data);
        this.eventSubject.next(data);
        this.updateOrders(order);
      } catch (error) {
        console.error('Error parsing order event:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.isConnected = false;
      this.reconnect();
    };
  }

  private reconnect(): void {
    setTimeout(() => {
      this.setupEventSource();
    }, 3000);
  }

  private updateOrders(newOrder: Order): void {
    this.ordersSignal.update(orders => {
      const existingIndex = orders.findIndex(o => o.orderId === newOrder.orderId);
      if (existingIndex >= 0) {
        return orders.map((order, index) =>
          index === existingIndex ? newOrder : order
        );
      }
      return [...orders, newOrder];
    });
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.isConnected = false;
    }
  }
}