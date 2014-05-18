
sudo -u postgres psql < db_schema.sql
sleep 1;
sudo -u postgres psql rsstool < table_schema.sql


