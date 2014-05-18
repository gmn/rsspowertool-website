-- sudo -u postgres psql rsstool < table_schema.sql 

DROP TABLE users;
CREATE TABLE users (
    id bigserial primary key,
    username varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    email varchar(100),
    date_added timestamp default NULL
);
GRANT ALL PRIVILEGES ON users to rssdude;
GRANT ALL on DATABASE rsstool TO rssdude;
GRANT ALL ON users_id_seq TO rssdude;


INSERT INTO users(username,password,email,date_added) VALUES ('gnaughto','paperplate','greg@naughton.org',NOW() );
INSERT INTO users(username,password,email,date_added) VALUES ('larryw','paperplate','larry@gmail.com',NOW() );
