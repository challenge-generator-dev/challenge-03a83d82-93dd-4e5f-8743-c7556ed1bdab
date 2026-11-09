import { Injectable, Inject, Logger } from '@nestjs/common';
import { OrderEventDTO } from '../../shared/dto/order-event.dto';
import { OrderEventPort } from '../../domain/ports/order-event.port';

@Injectable()
export class ProcessOrderEventUseCase {
  private readonly logger = new Logger(ProcessOrderEventUseCase.name);
  private readonly processedEvents: Map<string, number> = new Map();
  private readonly failedEvents: Map<string, number> = new Map();
  private totalProcessed = 0;
  private totalFailed = 0;

  constructor(
    @Inject('OrderEventPort')
    private readonly orderEventPort: OrderEventPort,
  ) {}

  async execute(event: OrderEventDTO): Promise<void> {
    const startTime = Date.now();
    const eventKey = `${event.orderId}-${event.timestamp}`;

    this.logger.log(`Procesando evento de orden: ${event.orderId}, tipo: ${event.eventType}`);

    try {
      event.validate();

      const existingCount = this.processedEvents.get(event.orderId) || 0;
      this.processedEvents.set(event.orderId, existingCount + 1);
      this.totalProcessed++;

      await this.orderEventPort.publish(event);

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Evento procesado exitosamente en ${processingTime}ms. ` +
        `Total procesados: ${this.totalProcessed}`,
      );
    } catch (error) {
      this.totalFailed++;
      const failedCount = this.failedEvents.get(event.orderId) || 0;
      this.failedEvents.set(event.orderId, failedCount + 1);

      this.logger.error(
        `Error al procesar evento de orden ${event.orderId}: ${error.message}`,
        error.stack,
      );

      await this.handleProcessingError(event, error);
    }
  }

  private async handleProcessingError(event: OrderEventDTO, error: Error): Promise<void> {
    const maxRetries = 3;
    const eventKey = `${event.orderId}-${event.timestamp}`;

    this.logger.warn(`Manejando error para evento ${eventKey}. Intentos restantes: ${maxRetries}`);

    if (error.message.includes('validation')) {
      this.logger.error(`Evento invalidado, no se reintentará: ${eventKey}`);
      return;
    }

    if (error.message.includes('timeout') || error.message.includes('connection')) {
      this.logger.warn(`Error de conexión detectado, el evento será reintentado por el consumidor Kafka`);
      return;
    }

    throw error;
  }

  getStatistics(): {
    totalProcessed: number;
    totalFailed: number;
    processedByOrder: Map<string, number>;
    failedByOrder: Map<string, number>;
  } {
    return {
      totalProcessed: this.totalProcessed,
      totalFailed: this.totalFailed,
      processedByOrder: new Map(this.processedEvents),
      failedByOrder: new Map(this.failedEvents),
    };
  }

  resetStatistics(): void {
    this.processedEvents.clear();
    this.failedEvents.clear();
    this.totalProcessed = 0;
    this.totalFailed = 0;
    this.logger.log('Estadísticas reinicializadas');
  }

  async processBatch(events: OrderEventDTO[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const event of events) {
      try {
        await this.execute(event);
        success++;
      } catch (error) {
        failed++;
        this.logger.error(`Error en procesamiento batch para evento ${event.orderId}`, error);
      }
    }

    return { success, failed };
  }

  getActiveOrders(): string[] {
    return Array.from(this.processedEvents.keys());
  }

  isOrderProcessed(orderId: string): boolean {
    return this.processedEvents.has(orderId);
  }

  getOrderProcessingCount(orderId: string): number {
    return this.processedEvents.get(orderId) || 0;
  }
}