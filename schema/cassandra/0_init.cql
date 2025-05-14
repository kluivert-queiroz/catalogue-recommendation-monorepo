CREATE KEYSPACE IF NOT EXISTS catalog 
WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

USE catalog;

CREATE TABLE IF NOT EXISTS watchlist (
    user_id text,
    show_id text,
    created_at timestamp,
    PRIMARY KEY (user_id, show_id)
);
