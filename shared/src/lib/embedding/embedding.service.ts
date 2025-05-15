// embedding.service.ts
import { Injectable } from '@nestjs/common';
import {
  FeatureExtractionPipeline,
  pipeline,
  Tensor,
} from '@xenova/transformers';

let embedder: FeatureExtractionPipeline;

@Injectable()
export class EmbeddingService {
  private async loadModel() {
    if (!embedder) {
      embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    await this.loadModel();
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    await this.loadModel();

    const output: Tensor = await embedder(texts, {
      pooling: 'mean',
      normalize: true,
    });

    // output.data is a flat Float32Array, so we reshape it
    const embeddingSize = output.dims[1]; // usually 384
    const batchSize = output.dims[0];

    const vectors: number[][] = [];

    for (let i = 0; i < batchSize; i++) {
      const start = i * embeddingSize;
      const end = start + embeddingSize;
      vectors.push(Array.from(output.data.slice(start, end)));
    }

    return vectors;
  }
}
