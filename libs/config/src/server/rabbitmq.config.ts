import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env['RABBITMQ_URL'] ?? 'amqp://admin:admin@localhost:5672',
  checksExchange: process.env['RABBITMQ_CHECKS_EXCHANGE'] ?? 'checks',
}));
