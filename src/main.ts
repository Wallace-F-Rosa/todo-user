import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.CLOUDAMQP_URL],
      queue: 'tasks',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('REST API exposing user functionalities on the Todo app')
    .setVersion('1.0')
    .addTag('user')
    .addBasicAuth()
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
