# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders/stream`
- `client` expone http (api: http://localhost:3000):
  - `GET /orders/stream`

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/test/order.controller.spec.ts` — `OrderController.onModuleInit`: Se invoca `onModuleInit` sobre `OrderController`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order.controller.spec.ts` — `OrderController.onModuleDestroy`: Se invoca `onModuleDestroy` sobre `OrderController`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/app/shared/utils/event-parser.ts` — `ParsedSSEvent.push`: Se invoca `push` sobre `ParsedSSEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261109074436524), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de visualización de órdenes en tiempo real
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial del consumidor Kafka — objetivo: Establecer una conexión con el topic Kafka y configurar el consumidor para recibir eventos. — entregable (NO resolver): Consumidor Kafka configurado y capaz de recibir eventos del topic de órdenes.
- Fase 2: Procesamiento y visualización de eventos — objetivo: Implementar la lógica para procesar los eventos recibidos y actualizar la interfaz de usuario en tiempo real. — entregable (NO resolver): Lógica implementada para procesar eventos y actualizar la interfaz de usuario con el estado de las órdenes en tiempo real.
- Fase 3: Optimización y manejo de errores — objetivo: Optimizar el rendimiento del consumidor Kafka y manejar posibles errores de forma efectiva. — entregable (NO resolver): Consumidor Kafka optimizado con un manejo de errores robusto para asegurar la disponibilidad y fiabilidad del sistema.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-events-stream",
  "version": "1.0.0",
  "description": "Sistema de visualización de órdenes en tiempo real usando Kafka y SSE",
  "main": "dist/main.js",
  "scripts": {
    "build": "rimraf dist && tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^11.2.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^11.2.0",
    "@nestjs/platform-express": "^11.2.0",
    "@nestjs/websockets": "^11.2.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "dotenv": "^16.3.1",
    "kafkajs": "^2.2.4",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.2.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.6",
    "@types/node": "^20.8.10",
    "@types/supertest": "^2.0.15",
    "@typescript-eslint/eslint-plugin": "^6.9.1",
    "@typescript-eslint/parser": "^6.9.1",
    "eslint": "^8.52.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.1",
    "jest": "^29.7.0",
    "prettier": "^3.0.3",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.0",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.2.2"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "paths": {
      "@app/*": ["src/*"],
      "@test/*": ["test/*"]
    }
  },
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumerAdapter } from './infrastructure/adapters/kafka/kafka-consumer.adapter';
import { OrderController } from './infrastructure/controllers/order.controller';
import { ProcessOrderEventUseCase } from './application/use-cases/process-order-event.usecase';
import { EventSerializer } from './shared/utils/event-serializer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Accept'],
  });

  const kafkaConsumerAdapter = app.get(KafkaConsumerAdapter);
  const processOrderEventUseCase = app.get(ProcessOrderEventUseCase);
  const orderController = app.get(OrderController);

  orderController.setupEventStream();

  await kafkaConsumerAdapter.connect();
  await kafkaConsumerAdapter.subscribe('orders', async (message) => {
    try {
      const event = EventSerializer.deserialize(message.value.toString());
      await processOrderEventUseCase.execute(event);
    } catch (error) {
      console.error('Error procesando mensaje Kafka:', error);
    }
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await kafkaConsumerAdapter.disconnect();
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    await kafkaConsumerAdapter.disconnect();
    await app.close();
    process.exit(0);
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});

// === ARCHIVO: api/src/domain/entities/order.entity.ts ===
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

// === ARCHIVO: api/src/domain/ports/order-event.port.ts ===
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

// === ARCHIVO: api/src/shared/dto/order-event.dto.ts ===
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

// === ARCHIVO: api/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { OrderController } from './infrastructure/controllers/order.controller';
import { KafkaConsumerAdapter } from './infrastructure/adapters/kafka/kafka-consumer.adapter';
import { KafkaConfig } from './infrastructure/config/kafka.config';
import { ProcessOrderEventUseCase } from './application/use-cases/process-order-event.usecase';
import { OrderEventPort } from './domain/ports/order-event.port';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: KafkaConfig,
      useFactory: (configService: ConfigService) => {
        return new KafkaConfig({
          clientId: configService.get<string>('KAFKA_CLIENT_ID', 'order-events-stream'),
          brokers: configService.get<string[]>('KAFKA_BROKERS', ['localhost:9092']),
          groupId: configService.get<string>('KAFKA_GROUP_ID', 'order-events-consumer-group'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: OrderEventPort,
      useClass: KafkaConsumerAdapter,
    },
    KafkaConsumerAdapter,
    ProcessOrderEventUseCase,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [ProcessOrderEventUseCase, OrderEventPort],
})
export class AppModule {}

// === ARCHIVO: api/src/infrastructure/config/kafka.config.ts ===
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Kafka, Consumer, KafkaConfig, logLevel } from 'kafkajs';

export { KafkaConfig } from 'kafkajs';

@Injectable()
export class KafkaConfigService {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly brokers: string[];
  private readonly clientId: string;
  private readonly groupId: string;
  private readonly topic: string;

  constructor(private readonly configService: NestConfigService) {
    this.brokers = this.parseBrokers(
      this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092'),
    );
    this.clientId = this.configService.get<string>('KAFKA_CLIENT_ID', 'order-events-consumer');
    this.groupId = this.configService.get<string>('KAFKA_GROUP_ID', 'order-events-group');
    this.topic = this.configService.get<string>('KAFKA_TOPIC', 'orders');

    const kafkaConfig: KafkaConfig = {
      clientId: this.clientId,
      brokers: this.brokers,
      logLevel: logLevel.WARN,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    };

    this.kafka = new Kafka(kafkaConfig);
    this.consumer = this.kafka.consumer({
      groupId: this.groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  private parseBrokers(brokersString: string): string[] {
    return brokersString.split(',').map((b) => b.trim()).filter(Boolean);
  }

  getKafkaInstance(): Kafka {
    return this.kafka;
  }

  getConsumer(): Consumer {
    return this.consumer;
  }

  getTopic(): string {
    return this.topic;
  }

  getBrokers(): string[] {
    return this.brokers;
  }

  getGroupId(): string {
    return this.groupId;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const admin = this.kafka.admin();
      await admin.connect();
      const topics = await admin.listTopics();
      await admin.disconnect();
      return topics.includes(this.topic);
    } catch (error) {
      return false;
    }
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
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

// === ARCHIVO: api/src/infrastructure/adapters/kafka/kafka-consumer.adapter.ts ===
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

// === ARCHIVO: api/src/shared/utils/event-serializer.ts ===
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

// === ARCHIVO: api/test/kafka-consumer.adapter.spec.ts ===
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

// === ARCHIVO: api/test/order.controller.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '@app/infrastructure/controllers/order.controller';
import { OrderEventPort } from '@app/domain/ports/order-event.port';
import { OrderEventDTO, OrderEventType } from '@app/shared/dto/order-event.dto';
import { Observable, Subject, of } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let mockOrderEventPort: Partial<OrderEventPort>;
  let eventStream$: Subject<OrderEventDTO>;

  beforeEach(async () => {
    eventStream$ = new Subject<OrderEventDTO>();

    mockOrderEventPort = {
      publish: jest.fn().mockResolvedValue(undefined),
      createEventStream: jest.fn().mockReturnValue(eventStream$.asObservable()),
      subscribe: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderEventPort,
          useValue: mockOrderEventPort,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    eventStream$.complete();
  });

  describe('streamOrders', () => {
    it('debería devolver un observable de eventos SSE', () => {
      const result = controller.streamOrders();
      expect(result).toBeInstanceOf(Observable);
    });

    it('debería crear un stream de eventos desde el puerto', () => {
      controller.streamOrders();
      expect(mockOrderEventPort.createEventStream).toHaveBeenCalled();
    });

    it('debería emitir eventos en formato SSE válido', (done) => {
      const mockEvent = new OrderEventDTO(
        'evt-1',
        OrderEventType.ORDER_CREATED,
        'order-123',
        { customerId: 'cust-1', amount: 100 },
        new Date(),
      );

      const stream$ = controller.streamOrders();

      stream$.subscribe({
        next: (data) => {
          const sseFormat = mockEvent.toSSEFormat();
          expect(data).toContain('event: order-event');
          expect(data).toContain('data:');
        },
        complete: () => done(),
      });

      eventStream$.next(mockEvent);
      eventStream$.complete();
    });

    it('debería manejar múltiples eventos consecutivos', (done) => {
      const events = [
        new OrderEventDTO('evt-1', OrderEventType.ORDER_CREATED, 'order-1', {}, new Date()),
        new OrderEventDTO('evt-2', OrderEventType.ORDER_UPDATED, 'order-1', {}, new Date()),
        new OrderEventDTO('evt-3', OrderEventType.ORDER_COMPLETED, 'order-1', {}, new Date()),
      ];

      const stream$ = controller.streamOrders();
      let eventCount = 0;

      stream$.subscribe({
        next: () => {
          eventCount++;
        },
        complete: () => {
          expect(eventCount).toBe(3);
          done();
        },
      });

      events.forEach((event) => eventStream$.next(event));
      eventStream$.complete();
    });

    it('debería manejar errores del stream y convertir a excepción HTTP', (done) => {
      const stream$ = controller.streamOrders();

      stream$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
          done();
        },
      });

      eventStream$.error(new Error('Stream error'));
    });

    it('debería cerrar el stream en cleanup', (done) => {
      const stream$ = controller.streamOrders();
      let completed = false;

      stream$.subscribe({
        next: () => {},
        complete: () => {
          completed = true;
          done();
        },
      });

      eventStream$.complete();
      expect(completed).toBe(true);
    });
  });

  describe('cabeceras SSE', () => {
    it('debería establecer content-type correcto para SSE', () => {
      const mockResponse = {
        setHeader: jest.fn(),
        statusCode: 200,
      };

      controller.streamOrders();
      expect(mockResponse.setHeader).toBeDefined();
    });

    it('debería configurar headers de caching deshabilitado', () => {
      const mockResponse = {
        setHeader: jest.fn(),
      };

      controller.streamOrders();
      expect(mockResponse.setHeader).toBeDefined();
    });
  });

  describe('integración con OrderEventPort', () => {
    it('debería delegar la creación del stream al puerto', () => {
      controller.streamOrders();
      expect(mockOrderEventPort.createEventStream).toHaveBeenCalledTimes(1);
    });

    it('debería manejar la suscripción a topics si es necesario', async () => {
      await controller.onModuleInit();
      expect(mockOrderEventPort.subscribe).toHaveBeenCalledWith(
        'orders',
        expect.any(Function),
      );
    });

    it('debería limpiar recursos al destruir el módulo', async () => {
      await controller.onModuleInit();
      await controller.onModuleDestroy();
      expect(eventStream$.isStopped).toBe(true);
    });
  });
});

// === ARCHIVO: api/src/application/use-cases/process-order-event.usecase.ts ===
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

// === ARCHIVO: api/src/shared/enums/order-status.enum.ts ===
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

// === ARCHIVO: api/src/shared/filters/global-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        errorDetails = responseObj;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errorDetails && { details: errorDetails }),
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}

// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "20.2.0",
    "@angular/cdk": "18.0.0",
    "@angular/common": "20.2.0",
    "@angular/compiler": "20.2.0",
    "@angular/core": "20.2.0",
    "@angular/forms": "20.2.0",
    "@angular/material": "18.0.0",
    "@angular/platform-browser": "20.2.0",
    "@angular/platform-browser-dynamic": "20.2.0",
    "@angular/router": "20.2.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.6.2",
    "zod": "^3.23.8",
    "zone.js": "~0.14.0",
    "@ngrx/effects": "^18.0.0",
    "@ngrx/store": "^18.0.0"
  },
  "devDependencies": {
    "@angular-builders/jest": "18.0.0",
    "@angular-devkit/build-angular": "20.2.0",
    "@angular/cli": "20.2.0",
    "@angular/compiler-cli": "20.2.0",
    "@types/jest": "29.5.12",
    "jest": "29.7.0",
    "jest-environment-jsdom": "29.7.0",
    "jest-preset-angular": "14.0.3",
    "typescript": "~5.4.2"
  }
}


// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss",
          "standalone": true
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": true,
              "extractLicenses": false,
              "vendorChunk": true
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false
            }
          },
          "defaultConfiguration": "development"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "development": {
              "browserTarget": "client:build:development"
            },
            "production": {
              "browserTarget": "client:build:production"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "client:build"
          }
        },
        "test": {
          "builder": "@angular-builders/jest:run",
          "options": {
            "configPath": "./jest.config.js",
            "tsConfig": "tsconfig.spec.json",
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ]
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "tsconfig.app.json",
              "tsconfig.spec.json"
            ],
            "exclude": []
          }
        }
      }
    }
  },
  "defaultProject": "client"
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}

// === ARCHIVO: client/src/app/shared/models/order.model.ts ===
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

// === ARCHIVO: client/src/app/core/services/order-event.service.ts ===
import { Injectable, signal } from '@angular/core';
import { OrderEventDTO, Order } from '../../shared/models/order.model';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private eventSource!: EventSource;
  private ordersSignal = signal<Order[]>([]);
  private eventSubject = new ReplaySubject<OrderEventDTO>(1);
  private isConnected = false;

  constructor() {
    this.setupEventSource();
  }

  get orders$(): Observable<Order[]> {
    return this.ordersSignal.asObservable();
  }

  get orderEvents$(): Observable<OrderEventDTO> {
    return this.eventSubject.asObservable();
  }

  getOrders(): Order[] {
    return this.ordersSignal();
  }

  private setupEventSource(): void {
    if (this.isConnected) return;

    this.eventSource = new EventSource(`${environment.apiUrl}/orders/stream`);

    this.eventSource.onopen = () => {
      this.isConnected = true;
      console.log('SSE connection established');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data: OrderEventDTO = JSON.parse(event.data);
        const order = Order.fromEventDTO(data);
        this.eventSubject.next(data);
        this.updateOrders(order);
      } catch (error) {
        console.error('Error parsing order event:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.isConnected = false;
      this.reconnect();
    };
  }

  private reconnect(): void {
    setTimeout(() => {
      this.setupEventSource();
    }, 3000);
  }

  private updateOrders(newOrder: Order): void {
    this.ordersSignal.update(orders => {
      const existingIndex = orders.findIndex(o => o.orderId === newOrder.orderId);
      if (existingIndex >= 0) {
        return orders.map((order, index) =>
          index === existingIndex ? newOrder : order
        );
      }
      return [...orders, newOrder];
    });
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.isConnected = false;
    }
  }
}

// === ARCHIVO: client/src/app/core/services/order-event.service.spec.ts ===
import { TestBed } from '@angular/core/testing';
import { OrderEventService } from './order-event.service';
import { OrderEventDTO, OrderStatus } from '../../shared/models/order.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { take } from 'rxjs/operators';

describe('OrderEventService', () => {
  let service: OrderEventService;
  const mockEventData: OrderEventDTO = {
    id: 'evt-1',
    orderId: 'ord-1',
    status: OrderStatus.PENDING,
    updatedAt: '2024-01-01T00:00:00Z',
    customerName: 'Test Customer',
    items: [
      { productId: 'prod-1', quantity: 2, price: 10.99 }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderEventService]
    });
    service = TestBed.inject(OrderEventService);
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit order events through orderEvents$', (done) => {
    service.orderEvents$.pipe(take(1)).subscribe(event => {
      expect(event).toEqual(mockEventData);
      done();
    });

    // Simulate event reception
    (service as any).eventSource = {
      onmessage: null,
      close: jest.fn()
    };
    (service as any).isConnected = true;
    (service as any).eventSource.onmessage({ data: JSON.stringify(mockEventData) });
  });

  it('should update orders signal when receiving new order', () => {
    const initialOrders = service.getOrders();
    expect(initialOrders.length).toBe(0);

    // Simulate event reception
    (service as any).eventSource = {
      onmessage: null,
      close: jest.fn()
    };
    (service as any).isConnected = true;
    (service as any).eventSource.onmessage({ data: JSON.stringify(mockEventData) });

    const updatedOrders = service.getOrders();
    expect(updatedOrders.length).toBe(1);
    expect(updatedOrders[0].orderId).toBe('ord-1');
  });

  it('should update existing order when receiving update', () => {
    // First event
    (service as any).eventSource = {
      onmessage: null,
      close: jest.fn()
    };
    (service as any).isConnected = true;
    (service as any).eventSource.onmessage({ data: JSON.stringify(mockEventData) });

    // Updated event
    const updatedEvent: OrderEventDTO = {
      ...mockEventData,
      status: OrderStatus.DELIVERED
    };
    (service as any).eventSource.onmessage({ data: JSON.stringify(updatedEvent) });

    const orders = service.getOrders();
    expect(orders.length).toBe(1);
    expect(orders[0].status).toBe(OrderStatus.DELIVERED);
  });

  it('should attempt reconnection on error', (done) => {
    jest.useFakeTimers();
    const setupSpy = jest.spyOn(service as any, 'setupEventSource');

    (service as any).eventSource = {
      onerror: null,
      close: jest.fn()
    };
    (service as any).isConnected = true;
    (service as any).eventSource.onerror(new Error('Connection error'));

    jest.advanceTimersByTime(3000);
    expect(setupSpy).toHaveBeenCalled();
    jest.useRealTimers();
    done();
  });
});

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error al iniciar la aplicación Angular:', err));

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>RealTime Orders</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Sistema de visualización de órdenes en tiempo real">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
  <noscript>
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>JavaScript requerido</h1>
      <p>Por favor, habilite JavaScript en su navegador para usar esta aplicación.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/styles.scss ===
@use '@angular/material' as mat;

:root {
  --primary-color: #1976d2;
  --primary-light: #63a4ff;
  --primary-dark: #004ba0;
  --accent-color: #ff4081;
  --accent-light: #ff79b0;
  --accent-dark: #c60055;
  --warn-color: #f44336;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --info-color: #2196f3;
  --text-primary: rgba(0, 0, 0, 0.87);
  --text-secondary: rgba(0, 0, 0, 0.54);
  --text-disabled: rgba(0, 0, 0, 0.38);
  --divider-color: rgba(0, 0, 0, 0.12);
  --background-color: #fafafa;
  --surface-color: #ffffff;
  --error-background: #ffebee;
  --success-background: #e8f5e9;
  --warning-background: #fff3e0;
  --info-background: #e3f2fd;
  --border-radius: 8px;
  --border-radius-small: 4px;
  --border-radius-large: 12px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  --font-family: 'Roboto', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-xxl: 1.5rem;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --shadow-1: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-2: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --shadow-3: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  --shadow-4: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  --shadow-5: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
}

$light-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,
    tertiary: mat.$rose-palette
  ),
  typography: (
    brand-family: 'Roboto',
    plain-family: 'Roboto'
  ),
  density: (
    scale: 0
  )
));

html {
  @include mat.all-component-themes($light-theme);
  font-size: 16px;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*,
*::before,
*::after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  width: 100%;
  font-family: var(--font-family);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--background-color);
}

body {
  overflow-x: hidden;
  overflow-y: auto;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
}

button {
  font-family: inherit;
  cursor: pointer;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

h1 {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
}

h2 {
  font-size: var(--font-size-xl);
}

h3 {
  font-size: var(--font-size-lg);
}

p {
  margin-bottom: var(--spacing-md);
}

ul, ol {
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

code, pre {
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-sm);
}

code {
  background-color: var(--info-background);
  padding: 2px 6px;
  border-radius: var(--border-radius-small);
}

pre {
  background-color: #263238;
  color: #eceff1;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  overflow-x: auto;

  code {
    background: none;
    padding: 0;
    color: inherit;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-justify {
  text-align: justify;
}

.text-uppercase {
  text-transform: uppercase;
}

.text-lowercase {
  text-transform: lowercase;
}

.text-capitalize {
  text-transform: capitalize;
}

.font-light {
  font-weight: var(--font-weight-light);
}

.font-regular {
  font-weight: var(--font-weight-regular);
}

.font-medium {
  font-weight: var(--font-weight-medium);
}

.font-bold {
  font-weight: var(--font-weight-bold);
}

.text-primary-color {
  color: var(--primary-color);
}

.text-accent-color {
  color: var(--accent-color);
}

.text-warn-color {
  color: var(--warn-color);
}

.text-success-color {
  color: var(--success-color);
}

.text-warning-color {
  color: var(--warning-color);
}

.text-info-color {
  color: var(--info-color);
}

.text-muted {
  color: var(--text-secondary);
}

.text-disabled {
  color: var(--text-disabled);
}

.bg-primary {
  background-color: var(--primary-color);
  color: white;
}

.bg-accent {
  background-color: var(--accent-color);
  color: white;
}

.bg-success {
  background-color: var(--success-background);
}

.bg-warning {
  background-color: var(--warning-background);
}

.bg-error {
  background-color: var(--error-background);
}

.bg-info {
  background-color: var(--info-background);
}

.d-flex {
  display: flex;
}

.d-block {
  display: block;
}

.d-inline-block {
  display: inline-block;
}

.d-none {
  display: none;
}

.flex-row {
  flex-direction: row;
}

.flex-column {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.align-start {
  align-items: flex-start;
}

.align-end {
  align-items: flex-end;
}

.align-center {
  align-items: center;
}

.align-stretch {
  align-items: stretch;
}

.gap-xs {
  gap: var(--spacing-xs);
}

.gap-sm {
  gap: var(--spacing-sm);
}

.gap-md {
  gap: var(--spacing-md);
}

.gap-lg {
  gap: var(--spacing-lg);
}

.gap-xl {
  gap: var(--spacing-xl);
}

.m-0 {
  margin: 0;
}

.mt-0 {
  margin-top: 0;
}

.mb-0 {
  margin-bottom: 0;
}

.ml-0 {
  margin-left: 0;
}

.mr-0 {
  margin-right: 0;
}

.p-0 {
  padding: 0;
}

.pt-0 {
  padding-top: 0;
}

.pb-0 {
  padding-bottom: 0;
}

.pl-0 {
  padding-left: 0;
}

.pr-0 {
  padding-right: 0;
}

.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.position-fixed {
  position: fixed;
}

.position-sticky {
  position: sticky;
}

.border {
  border: 1px solid var(--divider-color);
}

.border-radius {
  border-radius: var(--border-radius);
}

.border-radius-small {
  border-radius: var(--border-radius-small);
}

.border-radius-large {
  border-radius: var(--border-radius-large);
}

.shadow-1 {
  box-shadow: var(--shadow-1);
}

.shadow-2 {
  box-shadow: var(--shadow-2);
}

.shadow-3 {
  box-shadow: var(--shadow-3);
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-auto {
  overflow: auto;
}

.overflow-scroll {
  overflow: scroll;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-default {
  cursor: default;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.transition-fast {
  transition: all var(--transition-fast);
}

.transition-normal {
  transition: all var(--transition-normal);
}

.transition-slow {
  transition: all var(--transition-slow);
}

.opacity-0 {
  opacity: 0;
}

.opacity-50 {
  opacity: 0.5;
}

.opacity-100 {
  opacity: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-fadeIn {
  animation: fadeIn var(--transition-normal) forwards;
}

.animate-slideInUp {
  animation: slideInUp var(--transition-normal) forwards;
}

.animate-slideInDown {
  animation: slideInDown var(--transition-normal) forwards;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.mat-mdc-card {
  border-radius: var(--border-radius) !important;
  box-shadow: var(--shadow-2) !important;
}

.mat-mdc-button,
.mat-mdc-raised-button,
.mat-mdc-flat-button,
.mat-mdc-stroked-button {
  border-radius: var(--border-radius-small) !important;
}

.mat-mdc-form-field {
  width: 100%;
}

.mat-mdc-snack-bar-container {
  border-radius: var(--border-radius) !important;
}

.mat-mdc-dialog-container {
  border-radius: var(--border-radius-large) !important;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-color);
}

::-webkit-scrollbar-thumb {
  background: var(--text-disabled);
  border-radius: 4px;

  &:hover {
    background: var(--text-secondary);
  }
}

::selection {
  background-color: var(--primary-color);
  color: white;
}

:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

// === ARCHIVO: client/src/test.ts ===
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    <T>(id: string): T;
    keys(): string[];
  };
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: true },
  }
);

const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach((key) => {
  try {
    context(key);
  } catch (error) {
    if (error instanceof Error && error.message.includes('No module')) {
      console.warn(
        `Unable to load spec file: ${key}. This is expected when using lazy loading or standalone components that require additional setup.`
      );
    } else {
      throw error;
    }
  }
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'CSS', {
    value: null,
  });

  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      display: 'none',
      appearance: ['-webkit-appearance'],
    }),
  });

  Object.defineProperty(document, 'doctype', {
    value: '<!DOCTYPE html>',
  });

  Object.defineProperty(document.body.style, 'transform', {
    value: () => ({
      enumerable: true,
      configurable: true,
    }),
  });
}

if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'CSS', {
    value: null,
  });
}

Error.stackTraceLimit = Infinity;

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
});

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync()
  ]
};

// === ARCHIVO: client/src/app/app.component.ts ===
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">shopping_cart</mat-icon>
          <span class="app-title">Orders Admin</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/orders" routerLinkActive="active-link">
            <mat-icon matListItemIcon>receipt_long</mat-icon>
            <span matListItemTitle>Pedidos</span>
          </a>
          <a mat-list-item routerLink="/analytics" routerLinkActive="active-link">
            <mat-icon matListItemIcon>analytics</mat-icon>
            <span matListItemTitle>Analíticas</span>
          </a>
          <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Configuración</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <mat-toolbar color="primary" class="app-toolbar">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button>
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>

        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 260px;
      background: #1a1a2e;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .logo-icon {
      color: #6366f1;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .app-title {
      color: #f8fafc;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #f1f5f9;
    }

    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .active-link {
      background: rgba(99, 102, 241, 0.15) !important;
      border-right: 3px solid #6366f1;
    }

    .active-link mat-icon {
      color: #6366f1 !important;
    }

    .active-link span {
      color: #6366f1 !important;
      font-weight: 500;
    }
  `]
})
export class AppComponent {
  private sidenavOpened = true;

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}

// === ARCHIVO: client/src/app/features/orders/orders.component.ts ===
import { Component, OnInit, OnDestroy, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderEventService } from '../../core/services/order-event.service';
import { Order, OrderStatus } from '../../shared/models/order.model';
import { OrderItemComponent } from './order-item/order-item.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
    OrderItemComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderEventService);
  private snackBar = inject(MatSnackBar);

  orders = this.orderService.ordersSignal;
  isConnected = this.orderService.isConnected;
  
  pendingCount = computed(() => 
    this.orders().filter(o => o.status === OrderStatus.PENDING).length
  );

  processedCount = computed(() => 
    this.orders().filter(o => o.status === OrderStatus.PROCESSED).length
  );

  deliveredCount = computed(() => 
    this.orders().filter(o => o.status === OrderStatus.DELIVERED).length
  );

  totalRevenue = computed(() => 
    this.orders()
      .filter(o => o.status === OrderStatus.DELIVERED)
      .reduce((sum, order) => sum + (order.total || 0), 0)
  );

  lastUpdate = signal<Date | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentOrders = this.orders();
      if (currentOrders.length > 0) {
        this.lastUpdate.set(new Date());
        this.isLoading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.initializeConnection();
  }

  ngOnDestroy(): void {
    this.orderService.disconnect();
  }

  private initializeConnection(): void {
    try {
      this.orderService.setupEventSource();
      this.isLoading.set(false);
      this.showNotification('Conectado al stream de pedidos');
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  private handleConnectionError(error: unknown): void {
    this.isLoading.set(false);
    const message = error instanceof Error ? error.message : 'Error de conexión';
    this.errorMessage.set(message);
    this.showNotification(message, 'error');
  }

  reconnect(): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);
    this.orderService.disconnect();
    setTimeout(() => this.initializeConnection(), 1000);
  }

  refreshOrders(): void {
    this.isLoading.set(true);
    this.orderService.disconnect();
    setTimeout(() => {
      this.orderService.setupEventSource();
      this.isLoading.set(false);
      this.showNotification('Pedidos actualizados');
    }, 500);
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success']
    });
  }

  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: '#f59e0b',
      [OrderStatus.PROCESSED]: '#3b82f6',
      [OrderStatus.DELIVERED]: '#10b981'
    };
    return colors[status] || '#6b7280';
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}

// === ARCHIVO: client/src/app/features/orders/orders.component.html ===
<div class="orders-container">
  <header class="orders-header">
    <h1 class="orders-title">Órdenes en Tiempo Real</h1>
    <div class="orders-status">
      <span class="status-indicator" [class.connected]="isConnected$ | async"></span>
      <span class="status-text">{{ (isConnected$ | async) ? 'Conectado' : 'Desconectado' }}</span>
    </div>
  </header>

  <div class="orders-content" *ngIf="!(isLoading$ | async); else loadingTemplate">
    <div class="orders-list" *ngIf="(orders$ | async)?.length; else emptyTemplate">
      <app-order-item
        *ngFor="let order of orders$ | async; trackBy: trackByOrderId"
        [order]="order"
        class="order-item-wrapper">
      </app-order-item>
    </div>

    <ng-template #emptyTemplate>
      <div class="empty-state">
        <mat-icon class="empty-icon">inbox</mat-icon>
        <p class="empty-message">No hay órdenes disponibles</p>
        <p class="empty-hint">Las órdenes aparecerán aquí cuando se reciban eventos</p>
      </div>
    </ng-template>
  </div>

  <ng-template #loadingTemplate>
    <div class="loading-state">
      <mat-spinner diameter="48"></mat-spinner>
      <p class="loading-message">Conectando al stream de eventos...</p>
    </div>
  </ng-template>

  <footer class="orders-footer">
    <div class="connection-info">
      <span class="info-label">Total de órdenes:</span>
      <span class="info-value">{{ (orderCount$ | async) || 0 }}</span>
    </div>
    <div class="connection-info">
      <span class="info-label">Última actualización:</span>
      <span class="info-value">{{ lastUpdate$ | async | date:'medium' }}</span>
    </div>
    <button
      mat-stroked-button
      color="primary"
      (click)="refreshOrders()"
      class="refresh-button">
      <mat-icon>refresh</mat-icon>
      Actualizar
    </button>
  </footer>
</div>

// === ARCHIVO: client/src/app/features/orders/order-item/order-item.component.ts ===
import { Component, Input, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Order, OrderStatus } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent {
  @Input({ required: true }) order!: Order;

  private readonly orderSignal = signal<Order | null>(null);

  readonly statusConfig = computed(() => {
    const order = this.orderSignal();
    if (!order) return this.getDefaultStatusConfig();
    
    const statusMap: Record<OrderStatus, { label: string; icon: string; class: string }> = {
      [OrderStatus.PENDING]: { label: 'Pendiente', icon: 'schedule', class: 'status-pending' },
      [OrderStatus.PROCESSING]: { label: 'Procesando', icon: 'sync', class: 'status-processing' },
      [OrderStatus.PROCESSED]: { label: 'Procesada', icon: 'check_circle', class: 'status-processed' },
      [OrderStatus.DELIVERED]: { label: 'Entregada', icon: 'local_shipping', class: 'status-delivered' },
      [OrderStatus.CANCELLED]: { label: 'Cancelada', icon: 'cancel', class: 'status-cancelled' }
    };
    
    return statusMap[order.status] || this.getDefaultStatusConfig();
  });

  readonly formattedDate = computed(() => {
    const order = this.orderSignal();
    if (!order) return '';
    
    const date = new Date(order.updatedAt);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  });

  readonly timeAgo = computed(() => {
    const order = this.orderSignal();
    if (!order) return '';
    
    const now = new Date().getTime();
    const orderTime = new Date(order.updatedAt).getTime();
    const diffMs = now - orderTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} días`;
  });

  readonly isRecent = computed(() => {
    const order = this.orderSignal();
    if (!order) return false;
    
    const now = new Date().getTime();
    const orderTime = new Date(order.updatedAt).getTime();
    const diffMs = now - orderTime;
    return diffMs < 300000;
  });

  ngOnChanges(): void {
    if (this.order) {
      this.orderSignal.set(this.order);
    }
  }

  private getDefaultStatusConfig(): { label: string; icon: string; class: string } {
    return { label: 'Desconocido', icon: 'help', class: 'status-unknown' };
  }

  onRetry(): void {
    console.log(`Reintentando orden: ${this.order?.id}`);
  }

  onViewDetails(): void {
    console.log(`Ver detalles de orden: ${this.order?.id}`);
  }
}

// === ARCHIVO: client/src/app/features/orders/order-item/order-item.component.html ===
<mat-card class="order-card" [class.recent]="isRecent" [class.cancelled]="order?.status === orderStatusEnum.CANCELLED">
  <mat-card-header class="order-header">
    <div class="order-id-container">
      <mat-icon class="order-icon">receipt</mat-icon>
      <span class="order-id">{{ order?.id }}</span>
    </div>
    <mat-chip 
      [class]="statusConfig().class"
      class="status-chip"
      [matTooltip]="'Estado: ' + statusConfig().label">
      <mat-icon class="chip-icon">{{ statusConfig().icon }}</mat-icon>
      {{ statusConfig().label }}
    </mat-chip>
  </mat-card-header>

  <mat-card-content class="order-content">
    <div class="order-details">
      <div class="detail-row">
        <span class="detail-label">Cliente:</span>
        <span class="detail-value">{{ order?.customerName || 'No especificado' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Total:</span>
        <span class="detail-value amount">{{ order?.total | currency:'USD':'symbol':'1.2-2' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Items:</span>
        <span class="detail-value">{{ order?.items?.length || 0 }} productos</span>
      </div>
    </div>

    <div class="order-meta">
      <div class="meta-item" [matTooltip]="formattedDate()">
        <mat-icon class="meta-icon">access_time</mat-icon>
        <span class="meta-text">{{ timeAgo() }}</span>
      </div>
      <div class="meta-item" *ngIf="order?.updatedBy">
        <mat-icon class="meta-icon">person</mat-icon>
        <span class="meta-text">{{ order?.updatedBy }}</span>
      </div>
    </div>

    <div class="order-items-preview" *ngIf="order?.items?.length">
      <div class="items-label">
        <mat-icon>inventory_2</mat-icon>
        <span>Resumen del pedido</span>
      </div>
      <ul class="items-list">
        <li *ngFor="let item of order?.items?.slice(0, 3)" class="item-entry">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-quantity">x{{ item.quantity }}</span>
        </li>
        <li *ngIf="(order?.items?.length || 0) > 3" class="item-more">
          +{{ (order?.items?.length || 0) - 3 }} más
        </li>
      </ul>
    </div>
  </mat-card-content>

  <mat-card-actions class="order-actions">
    <button 
      mat-button 
      color="primary"
      (click)="onViewDetails()"
      class="action-button">
      <mat-icon>visibility</mat-icon>
      Ver detalles
    </button>
    <button 
      mat-button 
      *ngIf="order?.status === orderStatusEnum.PENDING"
      (click)="onRetry()"
      class="action-button">
      <mat-icon>refresh</mat-icon>
      Reintentar
    </button>
  </mat-card-actions>
</mat-card>

// === ARCHIVO: client/src/app/shared/utils/event-parser.ts ===
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

// === ARCHIVO: client/src/environments/environment.ts ===
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// === ARCHIVO: client/src/app/app.routes.ts ===
import { Routes } from '@angular/router';

export const routes: Routes = [];

// === ARCHIVO: client/tsconfig.app.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}

// === ARCHIVO: client/tsconfig.spec.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jest"
    ]
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
