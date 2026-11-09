import { z } from 'zod';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export const OrderEventDTOSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  status: z.nativeEnum(OrderStatus),
  updatedAt: z.string().datetime(),
  customerName: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    price: z.number()
  }))
});

export type OrderEventDTO = z.infer<typeof OrderEventDTOSchema>;

export class Order {
  constructor(
    public id: string,
    public orderId: string,
    public status: OrderStatus,
    public updatedAt: Date,
    public customerName: string,
    public items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>
  ) {}

  static fromEventDTO(dto: OrderEventDTO): Order {
    return new Order(
      dto.id,
      dto.orderId,
      dto.status,
      new Date(dto.updatedAt),
      dto.customerName,
      dto.items
    );
  }
}