interface ShowProps {
  id: number;
  type: string;
  name: string;
  originalName: string;
  overview: string;
  firstAirDate?: Date;
  lastAirDate?: Date;
  genres: string;
  popularity: number;
  originCountry: string;
  spokenLanguages: string;
  voteAverage: number;
  voteCount: number;
  productionCompanies: string;
  productionCountries: string;
  indexed: boolean;
}
export class ShowModel {
  id!: number;
  type!: string;
  name!: string;
  originalName!: string;
  overview!: string;
  firstAirDate?: Date;
  lastAirDate?: Date;
  genres!: string;
  popularity!: number;
  originCountry!: string;
  spokenLanguages!: string;
  voteAverage!: number;
  voteCount!: number;
  productionCompanies!: string;
  productionCountries!: string;
  indexed!: boolean;
  constructor(props: ShowProps) {
    Object.assign(this, props);
  }

  getEmbeddingString() {
    return `
    ${this.name}
    ${this.genres}
    ${this.overview}
    Rating: ${this.voteAverage}
    Popularity: ${this.popularity}
    Languages: ${this.spokenLanguages}
    Studio: ${this.productionCompanies}
    Country: ${this.originCountry}
    `;
  }
}
