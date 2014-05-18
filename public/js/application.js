
var pg = require('pg');

var conString = "postgres://rssdude:password@localhost/rsstool";

/* pool of connections
pg.connect(conString, function(err, client, done) {

  if (err) {
    return console.error('error fetching client from pool', err);
  }

  client.query('SELECT * from persons', function(err, result) {

    done(); //call `done()` to release the client back to the pool

    if (err) {
      return console.error('error running query', err);
    }

    console.log(JSON.stringify(result.rows,null,'  '));
  });
});
*/

var client = new pg.Client( conString );
client.connect( function(err) {
  if (err) {
    return console.error('error fetching client from pool', err);
  }

  client.query( 'select * from article', function(err, result) {
    if (err) {
      return console.error('error running query', err);
    }

    console.log(JSON.stringify(result.rows,null,'  '));
    client.end();
  });
});
