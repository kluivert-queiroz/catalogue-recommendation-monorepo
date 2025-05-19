import { Module } from '@nestjs/common';
import { ShowsService } from './services/shows.service';
import { ShowEntity } from './entities';
import { QdrantModule } from '../lib/qdrant';
import { EmbeddingModule } from '../lib/embedding';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowsController } from './shows.controller';
import { QueryHandlers } from './queries/handlers';
import { CqrsModule } from '@nestjs/cqrs';

const pgModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  entities: [ShowEntity],
  database: process.env.DB_NAME,
  synchronize: true,
  logging: ['error', 'schema'],
  namingStrategy: new SnakeNamingStrategy(),
});

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forFeature([ShowEntity]),
    QdrantModule,
    EmbeddingModule,
    pgModule,
  ],
  controllers: [ShowsController],
  exports: [ShowsService],
  providers: [...QueryHandlers, ShowsService],
})
export class ShowsModule {}
