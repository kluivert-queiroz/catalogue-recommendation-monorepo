import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { SchemaFor } from '@qdrant/js-client-rest/dist/types/types';

@Injectable()
export class QdrantService {
  private qdrantClient: QdrantClient;

  constructor() {
    this.qdrantClient = new QdrantClient({
      host: process.env.QDRANT_HOST,
      port: 6333,
    });
  }
  async createCollection(collectionName: string) {
    const collectionExists = await this.qdrantClient.collectionExists(
      collectionName
    );
    if (collectionExists.exists) {
      console.log(`Collection ${collectionName} already exists.`);
      return;
    }
    await this.qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 384, // Adjust based on your embedding size
        distance: 'Cosine',
      },
    });
  }

  private async setCollectionIndexingThreshold(
    collectionName: string,
    indexingThreshold: number
  ) {
    const collectionExists = await this.qdrantClient.collectionExists(
      collectionName
    );
    if (!collectionExists) {
      console.log(`Collection ${collectionName} does not exist.`);
      return;
    }
    this.qdrantClient.updateCollection(collectionName, {
      optimizers_config: {
        indexing_threshold: indexingThreshold,
      },
    });
  }
  async disableCollectionIndexing(collectionName: string) {
    await this.setCollectionIndexingThreshold(collectionName, 0);
  }
  async enableCollectionIndexing(collectionName: string) {
    await this.setCollectionIndexingThreshold(collectionName, 20000);
  }

  async addDocuments(
    collectionName: string,
    documents: SchemaFor<'PointStruct'>[]
  ) {
    const batchSize = 10000;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      await this.qdrantClient.upsert(collectionName, {
        wait: false,
        points: batch,
      });
    }
  }

  async search(
    collectionName: string,
    query: number[],
    {
      filter,
      limit = 5,
    }: {
      filter?: Partial<Pick<SchemaFor<'SearchRequest'>, 'filter'>>;
      limit?: number;
    }
  ) {
    return await this.qdrantClient.search(collectionName, {
      vector: query,
      filter: filter,
      limit: limit,
    });
  }
  async count(collectionName: string) {
    const collectionExists = await this.qdrantClient.collectionExists(
      collectionName
    );
    if (!collectionExists) {
      console.log(`Collection ${collectionName} does not exist.`);
      return { count: 0 };
    }
    const count = await this.qdrantClient.count(collectionName);
    return count;
  }
}
