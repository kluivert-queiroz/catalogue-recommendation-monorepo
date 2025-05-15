# Catalogue Recommendation Monorepo (WIP)

This is a recommendation system, users can send their watched shows and the system will use cosine similarity to suggest similar shows to them.


## Architecture

It's using CQRS pattern for the code, as soon as the user watchs a show a message is sent to RabbitMQ so the worker can consume it. It retrieves the show and ask Qdrant for similar shows, then writes similar shows on Cassandra so users can retrieve them from there.

## How to run

1. Run docker compose `docker compose up`
2. POST `/api/watchlist/:userId/watch-movie`
```json 
{
  "showId": 127532
}
```
3. GET `/api/recommendations/:userId` to see the recommendations
