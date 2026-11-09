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