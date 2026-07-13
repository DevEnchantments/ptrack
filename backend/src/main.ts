import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // API docs. Not mounted in production: NestJS holds the Supabase service-role
  // key and RLS is still deferred, so the schema stays off the public surface.
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('P-Track API')
      .setDescription(
        'Project Portfolio Management API. Every route requires a Supabase user ' +
          'JWT as "Authorization: Bearer <token>" unless marked otherwise.',
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'bearer',
      )
      // SupabaseAuthGuard is registered globally via APP_GUARD, so every route
      // is secured by default rather than per-controller @ApiBearerAuth().
      .addSecurityRequirements('bearer')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
