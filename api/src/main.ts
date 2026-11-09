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