import { Observable } from 'rxjs';
import { OrderEventDTO } from '../../shared/dto/order-event.dto';

/**
 * Puerto que define las operaciones para publicar y consumir eventos de órdenes.
 * La implementación concreta se proporcionará en la capa de infraestructura.
 */
export interface OrderEventPort {
  /**
   * Publica un evento de orden en el sistema de mensajes.
   * @param event Evento a publicar
   */
  publish(event: OrderEventDTO): Promise<void>;

  /**
   * Crea un stream de eventos de órdenes.
   * @returns Observable que emite eventos de órdenes
   */
  createEventStream(): Observable<OrderEventDTO>;

  /**
   * Suscribe un handler para procesar eventos de órdenes.
   * @param topic Nombre del topic de Kafka
   * @param handler Función que procesa el evento
   */
  subscribe(topic: string, handler: (event: OrderEventDTO) => Promise<void>): Promise<void>;
}