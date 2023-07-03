import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const config = new DocumentBuilder()
    .addCookieAuth('token')
    .addBearerAuth()
    .setDescription('Api to show tree for categories')
    .setTitle('Rebal Api for Matrixian')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: '*',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  await app.listen(3000);
}
bootstrap();
