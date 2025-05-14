
# You may add some other conditionals that fits your stuation here
until cqlsh -f /schema/cassandra/0_init.cql; do
  echo "cqlsh: Cassandra is unavailable to initialize - will retry later"
  sleep 2
done &

exec /usr/local/bin/docker-entrypoint.sh "$@"