import { OrderEventDTO } from '../models/order.model';

export interface ParsedSSEvent {
  type: string;
  data: OrderEventDTO | null;
  raw: string;
}

export interface SSEParserConfig {
  retryTimeout: number;
  maxRetries: number;
}

const DEFAULT_CONFIG: SSEParserConfig = {
  retryTimeout: 3000,
  maxRetries: 5,
};

export class SSEParser {
  private buffer: string = '';
  private config: SSEParserConfig;
  private retryCount: number = 0;

  constructor(config: Partial<SSEParserConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  feed(chunk: string): ParsedSSEvent[] {
    this.buffer += chunk;
    const events: ParsedSSEvent[] = [];
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      const parsed = this.parseLine(line);
      if (parsed) {
        events.push(parsed);
      }
    }

    return events;
  }

  private parseLine(line: string): ParsedSSEvent | null {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(':')) {
      return null;
    }

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) {
      return this.parseEventField(trimmed, '');
    }

    const field = trimmed.substring(0, colonIndex).trim();
    const value = trimmed.substring(colonIndex + 1).trim();
    return this.parseEventField(field, value);
  }

  private parseEventField(field: string, value: string): ParsedSSEvent | null {
    switch (field) {
      case 'event':
        return { type: value, data: null, raw: `${field}: ${value}` };
      case 'data':
        return this.parseDataField(value);
      case 'retry':
        const retryMs = parseInt(value, 10);
        if (!isNaN(retryMs)) {
          this.config.retryTimeout = retryMs;
        }
        return null;
      default:
        return null;
    }
  }

  private parseDataField(dataValue: string): ParsedSSEvent | null {
    try {
      const parsed = JSON.parse(dataValue) as OrderEventDTO;
      if (this.isValidOrderEvent(parsed)) {
        return {
          type: 'message',
          data: parsed,
          raw: `data: ${dataValue}`,
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  private isValidOrderEvent(obj: unknown): obj is OrderEventDTO {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }
    const record = obj as Record<string, unknown>;
    return (
      'orderId' in record &&
      'status' in record &&
      'updatedAt' in record
    );
  }

  flush(): ParsedSSEvent[] {
    const events: ParsedSSEvent[] = [];
    if (this.buffer.trim()) {
      const parsed = this.parseLine(this.buffer);
      if (parsed) {
        events.push(parsed);
      }
    }
    this.buffer = '';
    return events;
  }

  reset(): void {
    this.buffer = '';
    this.retryCount = 0;
  }

  getRetryTimeout(): number {
    return this.config.retryTimeout;
  }

  canRetry(): boolean {
    return this.retryCount < this.config.maxRetries;
  }

  incrementRetry(): void {
    this.retryCount++;
  }

  getRetryCount(): number {
    return this.retryCount;
  }
}

export function createSSEParser(config?: Partial<SSEParserConfig>): SSEParser {
  return new SSEParser(config);
}

export function parseSSEData<T>(dataString: string): T | null {
  try {
    return JSON.parse(dataString) as T;
  } catch {
    return null;
  }
}

export function formatEventForLog(event: ParsedSSEvent): string {
  const timestamp = new Date().toISOString();
  const eventType = event.type || 'unknown';
  const hasData = event.data ? 'yes' : 'no';
  return `[${timestamp}] SSE Event - Type: ${eventType}, HasData: ${hasData}`;
}