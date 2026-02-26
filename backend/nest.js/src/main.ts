import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3000'], // Allow specific origins
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'], // Specify allowed headers
    credentials: true, // Needed if you use cookies/auth headers
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that are not in the DTO
      forbidNonWhitelisted: true, // throws an error if non-whitelisted properties are present
      transform: true, // transform the data sent to the server to the type specified in the dto
      transformOptions: {
        enableImplicitConversion: true, // allows primitive types to be automatically converted
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
