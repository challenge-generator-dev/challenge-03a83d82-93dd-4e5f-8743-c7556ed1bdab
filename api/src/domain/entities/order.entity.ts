import { OrderStatus } from '../../shared/enums/order-status.enum';

/**
 * Entidad que representa una orden en el sistema.
 * Contiene los atributos y métodos necesarios para manejar el ciclo de vida de una orden.
 */
export class Order {
  constructor(
    public readonly id: string,
    public status: OrderStatus,
    public readonly customerId: string,
    public readonly items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public readonly totalAmount: number,
  ) {
    if (!id || typeof id !== 'string') {
      throw new Error('Order ID must be a non-empty string');
    }
    if (!Object.values(OrderStatus).includes(status)) {
      throw new Error('Invalid order status');
    }
    if (!customerId || typeof customerId !== 'string') {
      throw new Error('Customer ID must be a non-empty string');
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    if (createdAt > new Date()) {
      throw new Error('Created date cannot be in the future');
    }
    if (updatedAt < createdAt) {
      throw new Error('Updated date cannot be before created date');
    }
    if (totalAmount <= 0) {
      throw new Error('Total amount must be positive');
    }
  }

  /**
   * Actualiza el estado de la orden y la marca como actualizada.
   * @param newStatus Nuevo estado de la orden
   * @throws Error si el nuevo estado no es válido
   */
  updateStatus(newStatus: OrderStatus): void {
    if (!Object.values(OrderStatus).includes(newStatus)) {
      throw new Error('Invalid order status');
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  /**
   * Calcula el monto total de la orden basado en los items.
   * @returns Monto total calculado
   */
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * Valida si la orden está en un estado que permite transiciones.
   * @param allowedStatuses Estados permitidos para la transición
   * @returns true si la orden puede transicionar al nuevo estado
   */
  canTransitionTo(allowedStatuses: OrderStatus[]): boolean {
    return allowedStatuses.includes(this.status);
  }
}