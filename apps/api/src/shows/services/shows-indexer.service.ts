import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  EmbeddingService,
  QdrantService,
  ShowsService,
  ShowQdrantPayload
} from '@catalogue-recommendation-monorepo/shared';

@Injectable()
export class ShowsIndexerService implements OnApplicationBootstrap {
  private alreadyIndexed = false;
  constructor(
    private readonly showsService: ShowsService,
    private readonly qdrantService: QdrantService,
    private readonly embeddingService: EmbeddingService
  ) {}

  async onApplicationBootstrap() {
    console.log('[Startup] Checking if indexing is needed...');
    const hasIndexed = await this.wasIndexedToday();
    if (!hasIndexed) {
      console.log('[Startup] Running initial Qdrant indexing...');
      await this.indexToQdrant();
    } else {
      console.log('[Startup] Indexing already ran today.');
    }
  }
  async indexToQdrant() {
    try {
      console.log('[Indexing] Starting indexing to Qdrant...');
      await this.qdrantService.createCollection('shows');
      console.log('[Indexing] Collection created.');
      await this.qdrantService.disableCollectionIndexing('shows');
      console.log('[Indexing] Indexing disabled.');
      const shows = await this.showsService.getAllNotIndexedShows();
      console.log(
        `[Indexing] Found ${shows.length} shows to index. Starting indexing...`
      );
      const batchSize = 100;
      const batch = [];
      let showCount = 0;
      for (const show of shows) {
        showCount++;
        if (showCount % 1000 === 0) {
          console.log(
            `[Indexing] Progress: ${((showCount / shows.length) * 100).toFixed(
              2
            )}%`
          );
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
      console.log(
        `[Indexing] Indexed ${showCount} shows to Qdrant. Enabling indexing...`
      );
      await this.qdrantService.enableCollectionIndexing('shows');
      await this.recordIndexRun();
    } catch (error) {
      console.error('Error indexing shows to Qdrant:', error);
      throw new Error('Failed to index shows to Qdrant');
    }
  }

  private async wasIndexedToday(): Promise<boolean> {
    return Promise.resolve(this.alreadyIndexed);
  }

  private async recordIndexRun(): Promise<void> {
    this.alreadyIndexed = true;
    return Promise.resolve();
  }
}
