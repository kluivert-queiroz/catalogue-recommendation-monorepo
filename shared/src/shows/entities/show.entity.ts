import { Column, Entity, PrimaryColumn } from 'typeorm';
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

  @Column({ type: 'bool', default: false })
  indexed: boolean;

  toModel() {
    return new ShowModel({
      id: this.id,
      type: this.type,
      name: this.name,
      originalName: this.originalName,
      overview: this.overview,
      firstAirDate: this.firstAirDate ? new Date(this.firstAirDate) : null,
      lastAirDate: this.lastAirDate ? new Date(this.lastAirDate) : null,
      genres: this.genres,
      popularity: this.popularity,
      voteAverage: this.voteAverage,
      voteCount: this.voteCount,
      spokenLanguages: this.spokenLanguages,
      originCountry: this.originCountry,
      productionCompanies: this.productionCompanies,
      productionCountries: this.productionCountries,
      indexed: this.indexed,
    });
  }
}
