import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  controllers: [TaskController],
  providers: [
    ConfigService,
    TaskService,
    {
      provide: 'TASK_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('CLOUDAMQP_URL')],
            queue: 'tasks_queue',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
})
export class TaskModule {}
