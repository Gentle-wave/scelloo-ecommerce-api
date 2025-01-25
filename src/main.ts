import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Scelloo E-Commerce API')
    .setDescription('API for managing products in an e-commerce store')
    .setVersion('1.0')
    .addTag('products')
    .build();

  if (process.env.NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false, 
    });
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();