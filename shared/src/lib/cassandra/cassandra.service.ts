import { Injectable } from '@nestjs/common';
import { auth, Client, mapping } from 'cassandra-driver';

@Injectable()
export class CassandraService {
  client: Client;
  mapper: mapping.Mapper;
  private createClient() {
    this.client = new Client({
      contactPoints: [process.env.DB_CASSANDRA_HOST!],
      keyspace: process.env.DB_CASSANDRA_KEYSPACE!,
      localDataCenter: process.env.DB_CASSANDRA_DATACENTER!,
      authProvider: new auth.PlainTextAuthProvider(
        process.env.DB_CASSANDRA_USER!,
        process.env.DB_CASSANDRA_PASSWORD!,
      ),
    });
  }

  createMapper(mappingOptions: mapping.MappingOptions) {
    if (this.client == undefined) {
      this.createClient();
    }
    return new mapping.Mapper(this.client, mappingOptions);
  }
}
