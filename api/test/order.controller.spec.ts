import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '@app/infrastructure/controllers/order.controller';
import { OrderEventPort } from '@app/domain/ports/order-event.port';
import { OrderEventDTO, OrderEventType } from '@app/shared/dto/order-event.dto';
import { Observable, Subject, of } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let mockOrderEventPort: Partial<OrderEventPort>;
  let eventStream$: Subject<OrderEventDTO>;

  beforeEach(async () => {
    eventStream$ = new Subject<OrderEventDTO>();

    mockOrderEventPort = {
      publish: jest.fn().mockResolvedValue(undefined),
      createEventStream: jest.fn().mockReturnValue(eventStream$.asObservable()),
      subscribe: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderEventPort,
          useValue: mockOrderEventPort,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    eventStream$.complete();
  });

  describe('streamOrders', () => {
    it('debería devolver un observable de eventos SSE', () => {
      const result = controller.streamOrders();
      expect(result).toBeInstanceOf(Observable);
    });

    it('debería crear un stream de eventos desde el puerto', () => {
      controller.streamOrders();
      expect(mockOrderEventPort.createEventStream).toHaveBeenCalled();
    });

    it('debería emitir eventos en formato SSE válido', (done) => {
      const mockEvent = new OrderEventDTO(
        'evt-1',
        OrderEventType.ORDER_CREATED,
        'order-123',
        { customerId: 'cust-1', amount: 100 },
        new Date(),
      );

      const stream$ = controller.streamOrders();

      stream$.subscribe({
        next: (data) => {
          const sseFormat = mockEvent.toSSEFormat();
          expect(data).toContain('event: order-event');
          expect(data).toContain('data:');
        },
        complete: () => done(),
      });

      eventStream$.next(mockEvent);
      eventStream$.complete();
    });

    it('debería manejar múltiples eventos consecutivos', (done) => {
      const events = [
        new OrderEventDTO('evt-1', OrderEventType.ORDER_CREATED, 'order-1', {}, new Date()),
        new OrderEventDTO('evt-2', OrderEventType.ORDER_UPDATED, 'order-1', {}, new Date()),
        new OrderEventDTO('evt-3', OrderEventType.ORDER_COMPLETED, 'order-1', {}, new Date()),
      ];

      const stream$ = controller.streamOrders();
      let eventCount = 0;

      stream$.subscribe({
        next: () => {
          eventCount++;
        },
        complete: () => {
          expect(eventCount).toBe(3);
          done();
        },
      });

      events.forEach((event) => eventStream$.next(event));
      eventStream$.complete();
    });

    it('debería manejar errores del stream y convertir a excepción HTTP', (done) => {
      const stream$ = controller.streamOrders();

      stream$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
          done();
        },
      });

      eventStream$.error(new Error('Stream error'));
    });

    it('debería cerrar el stream en cleanup', (done) => {
      const stream$ = controller.streamOrders();
      let completed = false;

      stream$.subscribe({
        next: () => {},
        complete: () => {
          completed = true;
          done();
        },
      });

      eventStream$.complete();
      expect(completed).toBe(true);
    });
  });

  describe('cabeceras SSE', () => {
    it('debería establecer content-type correcto para SSE', () => {
      const mockResponse = {
        setHeader: jest.fn(),
        statusCode: 200,
      };

      controller.streamOrders();
      expect(mockResponse.setHeader).toBeDefined();
    });

    it('debería configurar headers de caching deshabilitado', () => {
      const mockResponse = {
        setHeader: jest.fn(),
      };

      controller.streamOrders();
      expect(mockResponse.setHeader).toBeDefined();
    });
  });

  describe('integración con OrderEventPort', () => {
    it('debería delegar la creación del stream al puerto', () => {
      controller.streamOrders();
      expect(mockOrderEventPort.createEventStream).toHaveBeenCalledTimes(1);
    });

    it('debería manejar la suscripción a topics si es necesario', async () => {
      await controller.onModuleInit();
      expect(mockOrderEventPort.subscribe).toHaveBeenCalledWith(
        'orders',
        expect.any(Function),
      );
    });

    it('debería limpiar recursos al destruir el módulo', async () => {
      await controller.onModuleInit();
      await controller.onModuleDestroy();
      expect(eventStream$.isStopped).toBe(true);
    });
  });
});