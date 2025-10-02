command to start server
docker compose --env-file .env up -d --build

Create tables and data 
docker exec -it auth_postgres psql -U appuser -d appdb -f /docker-entrypoint-initdb.d/init.sql


Database 
2. Query Postgres manually inside the container
Run an interactive session:
docker exec -it auth_postgres psql -U appuser -d appdb
Inside psql:
-- list tables
\dt

-- inspect table structure
\d users

-- check seeded rows
SELECT * FROM users;


Single line command 
docker exec -it auth_postgres psql -U appuser -d appdb -c "SELECT * FROM users;"


#Create .env with below data
POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppass
POSTGRES_DB=appdb
JWT_SECRET=change_this_in_prod
JWT_EXPIRE_MINUTES=120



build and run using docker-compose 
 docker compose --env-file .env up -d --build  
