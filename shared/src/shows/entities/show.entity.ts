import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ShowModel } from '../models/show.model';

export interface ShowQdrantPayload {
  id: number;
  genres: string;
  releaseYear: number;
  name: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  studio: string;
}

export enum IndexedState {
  NOT_INDEXED = 'not_indexed',
  INDEXING = 'indexing',
  INDEXED = 'indexed',
}

@Entity('shows')
export class ShowEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;
  @Column({ type: 'text' })
  type: string;
  @Column({ type: 'text', nullable: true })
  name: string;
  @Column({ type: 'text', nullable: true })
  originalName: string;
  @Column({ type: 'text', nullable: true })
  overview: string;
  @Column({ type: 'date', nullable: true })
  firstAirDate?: string;
  @Column({ type: 'date', nullable: true })
  lastAirDate?: string;
  @Column({ type: 'text', nullable: true })
  genres: string;
  @Column({ type: 'float', nullable: true })
  popularity: number;
  @Column({ type: 'text', nullable: true })
  originCountry: string;
  @Column({ type: 'text', nullable: true })
  spokenLanguages: string;
  @Column({ type: 'float', nullable: true })
  voteAverage: number;
  @Column({ type: 'int', nullable: true })
  voteCount: number;
  @Column({ type: 'text', nullable: true })
  productionCompanies: string;
  @Column({ type: 'text', nullable: true })
  productionCountries: string;

  @Column({
    type: 'enum',
    default: IndexedState.NOT_INDEXED,
    enum: IndexedState,
  })
  indexedState!: IndexedState;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  toModel() {
    return new ShowModel({
      id: this.id,
      type: this.type,
      name: this.name,
      originalName: this.originalName,
      overview: this.overview,
      firstAirDate: this.firstAirDate ? new Date(this.firstAirDate) : undefined,
      lastAirDate: this.lastAirDate ? new Date(this.lastAirDate) : undefined,
      genres: this.genres,
      popularity: this.popularity,
      voteAverage: this.voteAverage,
      voteCount: this.voteCount,
      spokenLanguages: this.spokenLanguages,
      originCountry: this.originCountry,
      productionCompanies: this.productionCompanies,
      productionCountries: this.productionCountries,
      indexedState: this.indexedState,
    });
  }
}
