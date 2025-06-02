import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { QdrantService } from '../../lib/qdrant';
import { EmbeddingService } from '../../lib/embedding';
import { ShowQdrantPayload } from '../entities';

@Injectable()
export class ShowsIndexerService implements OnApplicationBootstrap {
  constructor(
    private readonly showsService: ShowsService,
    private readonly qdrantService: QdrantService,
    private readonly embeddingService: EmbeddingService
  ) {}

  async onApplicationBootstrap() {
    console.log('[Startup] Checking if indexing is needed...');
    console.log('[Startup] Running initial Qdrant indexing...');
    await this.indexToQdrant();
  }
  async indexToQdrant() {
    try {
      console.time('[Indexing] Indexing shows to Qdrant');
      console.log('[Indexing] Starting indexing to Qdrant...');
      await this.qdrantService.createCollection('shows');
      console.log('[Indexing] Collection created.');
      await this.qdrantService.disableCollectionIndexing('shows');
      console.log('[Indexing] Indexing disabled.');
      await this.showsService.clearIndexingState();
      let { results: shows, count: totalShows } =
        await this.showsService.getReadyShowsForIndexing({ take: 10000 });
      console.log(`[Indexing] Starting indexing ${totalShows} shows...`);
      while (shows.length > 0) {
        const batchSize = 100;
        const batch = [];
        let showCount = 0;
        for (const show of shows) {
          showCount++;
          if (showCount % 1000 === 0) {
            console.log(`[Indexing] Progress: ${showCount} from ${totalShows}`);
          }

          const embedding = await this.embeddingService.generateEmbedding(
            show.getEmbeddingString()
          );

          batch.push({
            id: show.id,
            vector: embedding,
            payload: {
              id: show.id,
              genres: show.genres,
              releaseYear: show.firstAirDate?.getFullYear(),
              name: show.name,
              voteAverage: show.voteAverage,
              voteCount: show.voteCount,
              popularity: show.popularity,
              studio: show.productionCompanies,
            } as ShowQdrantPayload,
          });
          if (batch.length >= batchSize) {
            await Promise.all([
              this.qdrantService.addDocuments('shows', batch),
              this.showsService.markShowsAsIndexed(
                shows.slice(showCount - batchSize, showCount)
              ),
            ]);
            batch.length = 0; // Clear the batch
          }
        }
        if (batch.length > 0) {
          await Promise.all([
            this.qdrantService.addDocuments('shows', batch),
            this.showsService.markShowsAsIndexed(shows.slice(-batchSize)),
          ]);
        }
        const r = await this.showsService.getReadyShowsForIndexing({
          take: 10000,
        });
        shows = r.results;
        totalShows = r.count;
      }
      console.log(`[Indexing] Indexed shows to Qdrant. Enabling indexing...`);
      await this.qdrantService.enableCollectionIndexing('shows');
    } catch (error) {
      console.error('Error indexing shows to Qdrant:', error);
      throw new Error('Failed to index shows to Qdrant');
    }
    console.timeEnd('[Indexing] Indexing shows to Qdrant');
  }
}
