import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { SeederOptions } from 'typeorm-extension';

export const TypeOrmModuleConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const options: TypeOrmModuleOptions & SeederOptions = {
      type: 'mariadb',
      host: configService.get('database.host'),
      port: configService.get('database.port'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      database: configService.get('database.name'),
      autoLoadEntities: true,
      synchronize: configService.get('database.synchronize'),
      subscribers: ['dist/**/*.subscriber{.ts,.js}'],
      seeds: ['dist/**/database/seeds/**/*{.ts,.js}'],
      factories: ['dist/**/database/factories/**/*{.ts,.js}'],
    };
    return options;
  },
  inject: [ConfigService],
};

export const config: TypeOrmModuleOptions & SeederOptions = {
  type: 'mariadb',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASS || '',
  database: process.env.DATABASE_NAME || 'test',
  synchronize: process.env.NODE_ENV !== 'production',
  subscribers: ['dist/**/*.subscriber{.ts,.js}'],
  seeds: ['dist/**/database/seeds/**/*{.ts,.js}'],
  factories: ['dist/**/database/factories/**/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
};
