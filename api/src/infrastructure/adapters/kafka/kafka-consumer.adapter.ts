import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { KafkaConfigService } from '@app/infrastructure/config/kafka.config';
import { OrderEventDTO, OrderEventType } from '@app/shared/dto/order-event.dto';
import { OrderController } from '@app/infrastructure/controllers/order.controller';
import { EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaConsumerAdapter implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerAdapter.name);
  private isConnected: boolean = false;
  private isConsuming: boolean = false;
  private messageCount: number = 0;
  private errorCount: number = 0;

  constructor(
    private readonly kafkaConfigService: KafkaConfigService,
    private readonly orderController: OrderController,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Kafka consumer adapter');
    await this.connect();
    await this.subscribe(this.kafkaConfigService.getTopic(), this.handleMessage.bind(this));
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Shutting down Kafka consumer adapter');
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('Kafka consumer already connected');
      return;
    }

    try {
      const consumer = this.kafkaConfigService.getConsumer();
      await consumer.connect();
      this.isConnected = true;
      this.logger.log(`Connected to Kafka brokers: ${this.kafkaConfigService.getBrokers().join(', ')}`);
      this.logger.log(`Consumer group: ${this.kafkaConfigService.getGroupId()}`);
    } catch (error) {
      this.logger.error('Failed to connect to Kafka', error);
      throw new InternalServerErrorException('Kafka connection failed');
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn('Kafka consumer not connected');
      return;
    }

    try {
      const consumer = this.kafkaConfigService.getConsumer();
      await consumer.disconnect();
      this.isConnected = false;
      this.isConsuming = false;
      this.logger.log('Disconnected from Kafka');
    } catch (error) {
      this.logger.error('Failed to disconnect from Kafka', error);
      throw new InternalServerErrorException('Kafka disconnection failed');
    }
  }

  async subscribe(topic: string, handler: (event: OrderEventDTO) => Promise<void>): Promise<void> {
    if (!this.isConnected) {
      throw new BadRequestException('Kafka consumer not connected');
    }

    const consumer = this.kafkaConfigService.getConsumer();
    await consumer.subscribe({ topic, fromBeginning: false });
    this.logger.log(`Subscribed to topic: ${topic}`);

    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          this.messageCount++;
          const event = await this.processMessage(payload);
          await handler(event);
        } catch (error) {
          this.errorCount++;
          this.logger.error(`Error processing message: ${error}`);
        }
      },
    });

    this.isConsuming = true;
    this.logger.log(`Started consuming from topic: ${topic}`);
  }

  private async processMessage(payload: EachMessagePayload): Promise<OrderEventDTO> {
    const { message } = payload;

    if (!message.value) {
      throw new BadRequestException('Message value is null or undefined');
    }

    try {
      const valueString = message.value.toString();
      const parsed = JSON.parse(valueString);

      const eventDTO = new OrderEventDTO(
        parsed.eventId || this.generateEventId(),
        parsed.eventType || OrderEventType.ORDER_CREATED,
        parsed.orderId,
        parsed.status,
        parsed.previousStatus,
        parsed.timestamp || new Date().toISOString(),
        parsed.items || [],
        parsed.total || 0,
        parsed.customerId,
      );

      eventDTO.validate();
      return eventDTO;
    } catch (error) {
      this.logger.error(`Failed to parse message: ${error}`);
      throw new BadRequestException('Invalid message format');
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async handleMessage(event: OrderEventDTO): Promise<void> {
    this.logger.debug(`Processing event: ${event.eventId} - Type: ${event.eventType}`);
    
    const eventStream = this.orderController.getEventStream();
    eventStream.next(event);
    
    this.logger.log(
      `Event published to SSE - Order: ${event.orderId}, Status: ${event.status}`,
    );
  }

  isConnectedToKafka(): boolean {
    return this.isConnected;
  }

  isConsumingMessages(): boolean {
    return this.isConsuming;
  }

  getMessageCount(): number {
    return this.messageCount;
  }

  getErrorCount(): number {
    return this.errorCount;
  }

  getStats(): {
    connected: boolean;
    consuming: boolean;
    messageCount: number;
    errorCount: number;
  } {
    return {
      connected: this.isConnected,
      consuming: this.isConsuming,
      messageCount: this.messageCount,
      errorCount: this.errorCount,
    };
  }
}