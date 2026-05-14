import { Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('database.host'),
        port: configService.getOrThrow('database.port'),
        username: configService.getOrThrow('database.username'),
        password: configService.getOrThrow('database.password'),
        database: configService.getOrThrow('database.database'),
        entities: ['dist/**/*.entity.{js,ts}', 'src/**/*.entity.{js,ts}'],
        migrations: [
          'dist/database/migrations/**/*.{js,ts}',
          'src/database/migrations/**/*.{js,ts}',
        ],
        synchronize: true,
      }),
    } as TypeOrmModuleAsyncOptions),
  ],
  exports: [],
})
export class DatabaseModule {}
