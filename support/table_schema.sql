-- sudo -u postgres psql rsstool < table_schema.sql 

DROP TABLE article;
CREATE TABLE article (
    id bigserial primary key,
    name varchar(20) NOT NULL,
    description text NOT NULL,
    date_added timestamp default NULL
);
GRANT ALL PRIVILEGES ON article to rssdude;

INSERT INTO article(name,description,date_added) VALUES ('Michelle Obama','The first Lady''s tips on gardening, hairstyle and fashion',NOW());
INSERT INTO article(name,description,date_added) VALUES ('Steve Jobs','Jobs''s Children',NOW());
INSERT INTO article VALUES (null,'Wozniak','The guy who built the Apple at a soldering bench',NOW();
