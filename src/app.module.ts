import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { ThrottlerModule } from '@nestjs/throttler';
import * as secrets from './secrets';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: secrets.DB_HOST,
      port: 5432,
      username: secrets.DB_USERNAME,
      password: secrets.DB_PASSWORD,
      database: secrets.DB_DATABASE,
      entities: [Product],
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([Product]),
    ProductModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
