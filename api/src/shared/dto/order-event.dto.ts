import { IsEnum, IsString, IsDateString, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';

class OrderItemDTO {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class OrderEventDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  constructor(
    id: string,
    status: OrderStatus,
    customerId: string,
    items: OrderItemDTO[],
    createdAt: string,
    updatedAt: string,
    totalAmount: number,
    eventType: string,
  ) {
    this.id = id;
    this.status = status;
    this.customerId = customerId;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.totalAmount = totalAmount;
    this.eventType = eventType;
  }

  /**
   * Convierte el DTO a un formato serializable para SSE.
   * @returns Objeto serializable para eventos SSE
   */
  toSSEFormat(): { data: string } {
    return {
      data: JSON.stringify({
        id: this.id,
        status: this.status,
        customerId: this.customerId,
        items: this.items,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        totalAmount: this.totalAmount,
        eventType: this.eventType,
      }),
    };
  }

  /**
   * Valida el DTO y lanza una excepción si no cumple con las reglas.
   * @throws Error si el DTO no es válido
   */
  validate(): void {
    if (this.totalAmount <= 0) {
      throw new Error('Total amount must be positive');
    }
    if (new Date(this.updatedAt) < new Date(this.createdAt)) {
      throw new Error('Updated date cannot be before created date');
    }
    if (!['ORDER_CREATED', 'ORDER_UPDATED', 'ORDER_CANCELLED'].includes(this.eventType)) {
      throw new Error('Invalid event type');
    }
  }
}

export enum OrderEventType {
  CREATED = 'ORDER_CREATED',
  UPDATED = 'ORDER_UPDATED',
  CANCELLED = 'ORDER_CANCELLED',
}