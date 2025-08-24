import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // ✅ import ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Add global validation pipe here
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws error if unknown properties are sent
      transform: true, // automatically transforms payload to DTO class instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
