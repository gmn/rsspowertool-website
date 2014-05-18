
-- sudo -u postgres psql < db_schema.sql
DROP DATABASE rsstool;

DROP OWNED BY rssdude;
DROP USER rssdude;
CREATE USER rssdude WITH PASSWORD 'password';

CREATE DATABASE rsstool;
