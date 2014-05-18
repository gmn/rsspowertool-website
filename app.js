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


// catch POST
app.post("/login",function(req,res) 
{
  console.log( "in /login POST handler:" );
  return inspect(req,res);
});

app.get("/", function(req,res,next) 
{
  console.log( "in / GET handler:" );
  inspect(req,res);
  next();
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
