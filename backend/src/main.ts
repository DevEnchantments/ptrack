import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validate every incoming DTO; strip unknown fields; reject extras.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Let the Vite dev frontend call this API.
  app.enableCors({ origin: ['http://localhost:5173'] });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();