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