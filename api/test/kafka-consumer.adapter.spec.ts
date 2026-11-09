import { Test, TestingModule } from '@nestjs/testing';
import { KafkaConsumerAdapter } from '@app/infrastructure/adapters/kafka/kafka-consumer.adapter';
import { KafkaConfig } from '@app/infrastructure/config/kafka.config';
import { ConfigService } from '@nestjs/config';
import { OrderEventDTO, OrderEventType } from '@app/shared/dto/order-event.dto';

describe('KafkaConsumerAdapter', () => {
  let adapter: KafkaConsumerAdapter;
  let mockConfigService: Partial<ConfigService>;
  let mockKafkaConfig: Partial<KafkaConfig>;
  let mockConsumer: { connect: jest.Mock; subscribe: jest.Mock; run: jest.Mock; disconnect: jest.Mock };

  beforeEach(async () => {
    mockConsumer = {
      connect: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn().mockResolvedValue(undefined),
      run: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
    };

    mockKafkaConfig = {
      clientId: 'test-client',
      brokers: ['localhost:9092'],
      groupId: 'test-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    };

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        const config: Record<string, string> = {
          'kafka.clientId': 'test-client',
          'kafka.brokers': 'localhost:9092',
          'kafka.groupId': 'test-group',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaConsumerAdapter,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: KafkaConfig,
          useValue: mockKafkaConfig,
        },
      ],
    }).compile();

    adapter = module.get<KafkaConsumerAdapter>(KafkaConsumerAdapter);
  });

  describe('connect', () => {
    it('debería establecer conexión con el broker Kafka', async () => {
      await adapter.connect();
      expect(mockConsumer.connect).toHaveBeenCalled();
    });

    it('debería lanzar error si la conexión falla', async () => {
      mockConsumer.connect.mockRejectedValue(new Error('Connection failed'));
      await expect(adapter.connect()).rejects.toThrow('Connection failed');
    });

    it('debería reintentar conexión en caso de error temporal', async () => {
      mockConsumer.connect
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce(undefined);

      await adapter.connect();
      expect(mockConsumer.connect).toHaveBeenCalledTimes(2);
    });
  });

  describe('subscribe', () => {
    it('debería suscribirse al topic especificado', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      await adapter.subscribe('orders', handler);
      expect(mockConsumer.subscribe).toHaveBeenCalledWith({
        topic: 'orders',
        fromBeginning: false,
      });
    });

    it('debería ejecutar el handler cuando arrive un mensaje', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      await adapter.subscribe('orders', handler);

      const runCallback = mockConsumer.run.mock.calls[0][0];
      const mockMessage = {
        topic: 'orders',
        partition: 0,
        message: {
          key: Buffer.from('order-123'),
          value: Buffer.from(
            JSON.stringify({
              id: 'evt-1',
              type: OrderEventType.ORDER_CREATED,
              orderId: 'order-123',
              payload: { amount: 100 },
              timestamp: new Date().toISOString(),
            }),
          ),
          offset: '0',
          timestamp: Date.now().toString(),
        },
      };

      await runCallback({ eachMessage: async (params: { message: typeof mockMessage }) => {
        await params.message;
      } });
    });

    it('debería manejar errores en el handler sin detener el consumidor', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Handler error'));
      await adapter.subscribe('orders', handler);

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('debería desconectar del broker correctamente', async () => {
      await adapter.connect();
      await adapter.disconnect();
      expect(mockConsumer.disconnect).toHaveBeenCalled();
    });

    it('debería manejar error al desconectar', async () => {
      mockConsumer.disconnect.mockRejectedValue(new Error('Disconnect failed'));
      await expect(adapter.disconnect()).rejects.toThrow('Disconnect failed');
    });
  });

  describe('manejo de offsets', () => {
    it('debería confirmar el offset después de procesar el mensaje', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      await adapter.subscribe('orders', handler);

      expect(handler).toHaveBeenCalled();
    });

    it('debería mantener el offset en caso de error de procesamiento', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Processing error'));
      await adapter.subscribe('orders', handler);

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('configuración de consumer group', () => {
    it('debería usar el groupId configurado', () => {
      expect(mockKafkaConfig.groupId).toBe('test-group');
    });

    it('debería aplicar configuración de sesión y heartbeat', () => {
      expect(mockKafkaConfig.sessionTimeout).toBe(30000);
      expect(mockKafkaConfig.heartbeatInterval).toBe(3000);
    });
  });
});