import {
  Controller,
  Get,
  Res,
  Sse,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, Subject, map, catchError, finalize } from 'rxjs';
import { Response } from 'express';
import { OrderEventDTO, OrderEventType } from '@app/shared/dto/order-event.dto';

@Controller('orders')
export class OrderController {
  private readonly eventStream: Subject<OrderEventDTO>;
  private activeConnections: number = 0;

  constructor() {
    this.eventStream = new Subject<OrderEventDTO>();
  }

  @Get('stream')
  @Sse('stream')
  streamOrders(): Observable<MessageEvent> {
    this.activeConnections++;

    return this.eventStream.asObservable().pipe(
      map((event: OrderEventDTO) => {
        const sseData = this.serializeSSEEvent(event);
        return new MessageEvent('message', { data: sseData });
      }),
      catchError((error: Error) => {
        console.error('Error in event stream:', error.message);
        throw new InternalServerErrorException('Event stream failed');
      }),
      finalize(() => {
        this.activeConnections--;
        console.log(`SSE connection closed. Active connections: ${this.activeConnections}`);
      }),
    );
  }

  private serializeSSEEvent(event: OrderEventDTO): string {
    const ssePayload = {
      eventId: event.eventId,
      eventType: event.eventType,
      orderId: event.orderId,
      status: event.status,
      previousStatus: event.previousStatus,
      timestamp: event.timestamp,
      items: event.items,
      total: event.total,
      customerId: event.customerId,
    };
    return JSON.stringify(ssePayload);
  }

  getActiveConnections(): number {
    return this.activeConnections;
  }

  getEventStream(): Subject<OrderEventDTO> {
    return this.eventStream;
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck(): { status: string; activeConnections: number } {
    return {
      status: 'ok',
      activeConnections: this.activeConnections,
    };
  }

  @Get('events/history')
  @HttpCode(HttpStatus.OK)
  getEventHistory(): { message: string } {
    return {
      message: 'Event history endpoint - requires implementation with persistent storage',
    };
  }
}