CREATE KEYSPACE IF NOT EXISTS catalog 
WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

USE catalog;

CREATE TABLE IF NOT EXISTS watchlist (
    user_id text,
    show_id int,
    created_at timestamp,
    PRIMARY KEY (user_id, show_id)
);

CREATE TABLE IF NOT EXISTS recommendations (
    user_id text,
    show_id int,
    name text,
    genre text,
    popularity float,
    release_year int,
    vote_average float,
    score float,
    created_at timestamp,
    PRIMARY KEY ((user_id), score, genre)
) WITH CLUSTERING ORDER BY (score DESC);
