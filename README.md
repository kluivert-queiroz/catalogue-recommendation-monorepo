# Catalogue Recommendation System

A microservices-based recommendation system that suggests similar shows to users based on their watch history. The system uses cosine similarity and vector embeddings to provide personalized content recommendations.

## Features

- Real-time recommendation processing using CQRS pattern
- Scalable microservices architecture
- Vector similarity search using Qdrant
- Message queue-based event processing with RabbitMQ
- Distributed data storage with Cassandra and PostgreSQL
- NestJS-based API and worker services

## Architecture

The system follows the CQRS (Command Query Responsibility Segregation) pattern:

1. When a user watches a show, the API service sends a message to RabbitMQ
2. Worker services consume these messages and process them asynchronously
3. The worker retrieves show information and uses Qdrant for vector similarity search
4. Similar shows are stored in Cassandra for fast retrieval
5. Users can query their recommendations through the API

### System Components

- **API Service**: Handles HTTP requests and commands
- **Worker Service**: Processes watch events and generates recommendations
- **Qdrant**: Vector similarity search engine
- **Cassandra**: Stores user recommendations
- **PostgreSQL**: Stores show metadata
- **RabbitMQ**: Message broker for event processing

### Sequence Diagram
![Sequence Diagram](/docs/sequence-diagram.png?raw=true)

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- pnpm 10.10.0+

## How to run

1. Start the services using Docker Compose:
```bash
docker compose up
```

This will start all required services:
- API service on port 3000
- RabbitMQ management UI on port 15672
- Qdrant on ports 6333 (REST) and 6334 (gRPC)
- Cassandra on port 9042
- PostgreSQL on port 5432

## Usage

### Adding a Show to Watch History

```bash
curl -X POST http://localhost:3000/api/watchlist/{userId}/watch-movie \
  -H "Content-Type: application/json" \
  -d '{"showId": 127532}'
```

### Retrieving Recommendations

```bash
curl http://localhost:3000/api/recommendations/{userId}
```

## Development

### Running Services Locally

1. Start dependencies:
```bash
docker compose up cassandra1 postgres qdrant rabbitmq
```

2. Run the API service:
```bash
# Don't forget to change services host on .env 
nx serve api
```

3. Run a worker:
```bash
nx serve worker
```

### Running Tests

```bash
# Run all tests
nx run-many --target=test --all

# Run specific project tests
nx test api
nx test worker
```

## Monitoring/Docs

- RabbitMQ Management UI: http://localhost:15672 (user/password)
- API Swagger Documentation: http://localhost:3000/api/docs

## Resource Requirements

The system is configured with the following resource limits(for fun):
- API: 0.5 CPU, 256MB RAM
- Worker: 0.5 CPU, 256MB RAM
- Cassandra: 2 CPU, 6GB RAM
- PostgreSQL: 0.1 CPU, 256MB RAM
- Qdrant: 0.5 CPU, 512MB RAM
- RabbitMQ: 0.3 CPU, 256MB RAM


