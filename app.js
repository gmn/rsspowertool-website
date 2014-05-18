
// support/modules
var lib = require( './lib.js' );
var db = require('./db.js');

// express
var express = require('express');
var app = express();


// middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(bodyParser());
app.use(cookieParser('shhhh, very secret'));
app.use(session());

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});


function inspect(req,res) {
  var s = '<style type="text/css">body{font-family:courier;}</style>';
  s += '<table class="a">';
  ['host','method','url','path','params','body','query','route','cookies',function(x){res.send(x)}].forEach(function(elt){
    if ( !(elt instanceof Function) )
      s += '<tr><td><b>'+elt+'</b></td><td>' + JSON.stringify(req[elt]) + '</td></tr>';
    else
      elt(s+'</table>'); 
  });
}

// only handles if a query is present 
app.get("/", function(req,res,next) 
{
  if ( lib.objEmpty(req.query) )
    next();
  else {
    console.log( "using GET query handler:" );
    inspect(req,res);
  }
});

app.get('/users', function(req,res,next) {
  db.get_users(function(rows) {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write('<pre>'+JSON.stringify(rows,null,'  ')+'</pre>');
      res.end();
  } );
});

// catch POST
app.post("/login",function(req,res,next) 
{
  console.log( "using /login POST handler:" );
  //return inspect(req,res);

  // sanitize
  var form = {};
  for (i in req.body) {
    if ( req.body.hasOwnProperty(i) )
      form[i] = req.body[i] ? req.body[i].trim() : '';
  }

  db.query( "INSERT INTO users(username,password,email,date_added) VALUES ('"+form.username+"','"+form.password+"','"+form.email+"',NOW());" );

  res.redirect('/users');
});


// express provided static-directory handler middleware
app.use(express.static(__dirname + '/public'));


//
// error handlers
//
// there is a reason why error handlers appear at the end of the chain
//  because none of the other handlers, handled the request; 
//  so it fell through to the bottom; the error handler is 
//  the catch-all at the end of the chain
// 

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send( '<pre>'+JSON.stringify({
        message: err.message,
        error: err
    },null, '  ')+'</pre>');
});

app.listen(3000);
