import { TestBed } from '@angular/core/testing';
import { OrderEventService } from './order-event.service';
import { OrderEventDTO, OrderStatus } from '../../shared/models/order.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { take } from 'rxjs/operators';

describe('OrderEventService', () => {
  let service: OrderEventService;
  const mockEventData: OrderEventDTO = {
    id: 'evt-1',
    orderId: 'ord-1',
    status: OrderStatus.PENDING,
    updatedAt: '2024-01-01T00:00:00Z',
    customerName: 'Test Customer',
    items: [
      { productId: 'prod-1', quantity: 2, price: 10.99 }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderEventService]
    });
    service = TestBed.inject(OrderEventService);
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit order events through orderEvents$', (done) => {
    service.orderEvents$.pipe(take(1)).subscribe(event => {
      expect(event).toEqual(mockEventData);
      done();
    });

    // Simulate event reception
    (service as any).eventSource = {
      onmessage: null,
      close: jest.fn()
    };
    (service as any).isConnected = true;
    (service as any).eventSource.onmessage({ data: JSON.stringify(mockEventData) });
  });

  it('should update orders signal when receiving new order', () => {
    const initialOrders = service.getOrders();
    expect(initialOrders.length).toBe(0);

    // Simulate event reception
    (service as any).eventSource = {
      onmessage: null,
      close: jest.fn()
    };
    (service as any).isConnected = true;
    (service as any).eventSource.onmessage({ data: JSON.stringify(mockEventData) });

    const updatedOrders = service.getOrders();
    expect(updatedOrders.length).toBe(1);
    expect(updatedOrders[0].orderId).toBe('ord-1');
  });

  it('should update existing order when receiving update', () => {
    // First event
    (service as any).eventSource = {
      onmessage: null,
      close: jest.fn()
    };
    (service as any).isConnected = true;
    (service as any).eventSource.onmessage({ data: JSON.stringify(mockEventData) });

    // Updated event
    const updatedEvent: OrderEventDTO = {
      ...mockEventData,
      status: OrderStatus.DELIVERED
    };
    (service as any).eventSource.onmessage({ data: JSON.stringify(updatedEvent) });

    const orders = service.getOrders();
    expect(orders.length).toBe(1);
    expect(orders[0].status).toBe(OrderStatus.DELIVERED);
  });

  it('should attempt reconnection on error', (done) => {
    jest.useFakeTimers();
    const setupSpy = jest.spyOn(service as any, 'setupEventSource');

    (service as any).eventSource = {
      onerror: null,
      close: jest.fn()
    };
    (service as any).isConnected = true;
    (service as any).eventSource.onerror(new Error('Connection error'));

    jest.advanceTimersByTime(3000);
    expect(setupSpy).toHaveBeenCalled();
    jest.useRealTimers();
    done();
  });
});