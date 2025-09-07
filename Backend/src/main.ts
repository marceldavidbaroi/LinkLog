import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; // ✅ default import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Use cookie parser
  app.use(cookieParser());

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Enable CORS for frontend with cookies
  app.enableCors({
    origin: 'http://localhost:5173', // your frontend
    credentials: true, // needed for cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
