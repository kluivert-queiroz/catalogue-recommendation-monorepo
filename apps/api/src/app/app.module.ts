import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { ShowsModule } from '../shows/shows.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { QdrantModule } from '../common/qdrant/qdrant.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { CassandraService } from '../common/cassandra/cassandra.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { ConfigModule } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ShowEntity } from '../shows/repositories/entities/show.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


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
    WatchlistModule,
    ShowsModule,
    ConfigModule.forRoot(),
    pgModule,
    EmbeddingModule,
    QdrantModule,
  ],
  providers: [CassandraService, EmbeddingService],
})
export class AppModule {}
