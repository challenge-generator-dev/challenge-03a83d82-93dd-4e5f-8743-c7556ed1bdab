import { OrderEventDTO, OrderEventType } from '@app/shared/dto/order-event.dto';

export interface SerializedEvent {
  id: string;
  type: string;
  orderId: string;
  payload: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class EventSerializer {
  serialize(event: OrderEventDTO): SerializedEvent {
    const serialized: SerializedEvent = {
      id: event.id,
      type: event.type,
      orderId: event.orderId,
      payload: JSON.stringify(event.payload),
      timestamp: event.timestamp,
    };

    if (event.metadata) {
      serialized.metadata = event.metadata;
    }

    return serialized;
  }

  deserialize(data: SerializedEvent): OrderEventDTO {
    const event = new OrderEventDTO(
      data.id,
      data.type as OrderEventType,
      data.orderId,
      JSON.parse(data.payload),
      new Date(data.timestamp),
    );

    if (data.metadata) {
      event.metadata = data.metadata;
    }

    return event;
  }

  serializeToBuffer(event: OrderEventDTO): Buffer {
    const serialized = this.serialize(event);
    return Buffer.from(JSON.stringify(serialized));
  }

  deserializeFromBuffer(buffer: Buffer): OrderEventDTO {
    const data = JSON.parse(buffer.toString()) as SerializedEvent;
    return this.deserialize(data);
  }

  serializeToSSE(event: OrderEventDTO): string {
    return event.toSSEFormat();
  }

  parseIncomingEvent(rawData: string): OrderEventDTO | null {
    try {
      const parsed = JSON.parse(rawData);
      const event = new OrderEventDTO(
        parsed.id,
        parsed.type as OrderEventType,
        parsed.orderId,
        parsed.payload,
        new Date(parsed.timestamp),
      );

      if (parsed.metadata) {
        event.metadata = parsed.metadata;
      }

      event.validate();
      return event;
    } catch (error) {
      return null;
    }
  }

  validateEventType(type: string): boolean {
    const validTypes = Object.values(OrderEventType);
    return validTypes.includes(type as OrderEventType);
  }

  sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          sanitized[key] = value.trim();
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          sanitized[key] = this.sanitizePayload(value as Record<string, unknown>);
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }
}

export const eventSerializer = new EventSerializer();