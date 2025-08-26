import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Enable CORS for your frontend
  app.enableCors({
    origin: 'http://localhost:5173', // your Vite frontend
    credentials: true, // only needed if using cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
