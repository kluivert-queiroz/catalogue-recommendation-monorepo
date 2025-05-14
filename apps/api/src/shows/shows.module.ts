import { Module } from '@nestjs/common';
import { ShowsService } from './services/shows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowEntity } from './repositories/entities/show.entity';
import { QdrantModule } from '../common/qdrant/qdrant.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { ShowsIndexerService } from './services/shows-indexer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShowEntity]),
    QdrantModule,
    EmbeddingModule,
  ],
  exports: [ShowsService, ShowsIndexerService],
  providers: [ShowsService, ShowsIndexerService],
})
export class ShowsModule {}
