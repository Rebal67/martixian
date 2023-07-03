import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TypeOrmModuleConfig } from './typeormConfig';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['../.env', './.env'],
      isGlobal: true,
    }),
    HttpModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync(TypeOrmModuleConfig),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
