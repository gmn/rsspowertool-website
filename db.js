var conString = "postgres://rssdude:password@localhost/rsstool";

function get_users(callback) 
{
  var pg = require('pg');
  var client = new pg.Client( conString );

  client.connect( function(err) 
  {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query( 'select * from users', function(err, result) {
      if (err) {
        return console.error('error running query', err);
      }

      //console.log(JSON.stringify(result.rows,null,'  '));
      if ( callback )
        callback(result.rows);

      client.end();
    });
  });
}
exports.get_users = get_users;

function query( qstring, callback ) 
{
  if ( arguments.length < 1 ) 
    return console.error( "not enough arguments to db.query" );

  var pg = require('pg');
  var client = new pg.Client( conString );

  client.connect( function(err) 
  {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query( qstring, function(err, result) 
    {
      if (err) {
        return console.error('error running query', err);
      }
      if ( callback )
        callback(result.rows);
      client.end();
    });
  });
}
exports.query = query;


/*query( "INSERT INTO users(username,password,email,date_added) VALUES ('gnaughto','paperplate','greg@naughton.org', NOW() );" , function() {
    get_users(function(s){console.log(JSON.stringify(s,null,'  '))});
  }
); */

