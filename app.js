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

// express provides static-directory handler middleware
app.use(express.static(__dirname + '/public'));

// catch POST
app.post("/login",function(req,res) {

  console.log( "in POST handler:" );
  
  if ( req.params ) {
      var s = '';
      function _f(x) { res.send(x); }
      ['method','url','params','body','query','route','cookies','path','host',_f].forEach(function(x){
          if ( x instanceof Function )
              x(s); 
          else
              s += '<b>' + x + '</b><br><pre> ' + JSON.stringify(req[x]) + '</pre>';
      });
  } else
  res.send('Hello World');
});

//
// the reason why error handlers appear at the end of the chain
//  is because none of the other handlers, static or renderers,
//  handled the request; so it fell through to here; the error
//  handler is the catch-all at the end of the chain
// 
app.use(function(req, res){
  res.send('Hello World');
});

app.listen(3000);
