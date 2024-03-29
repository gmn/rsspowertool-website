//
// lib.js - collection of helper functions & classes 
//

(function() {

    var fs = require('fs');
    var util = require('util');
    var path = require('path');

    function type_of( v ) {
        var s = typeof v;
        switch( s ) {
        case "object":
            if ( util.isDate( v ) ) {
                return "date";
            }
            else if ( util.isArray( v ) ) {
                return "array";
            }
            else if ( util.isRegExp( v ) ) {
                return "regexp";
            }
            return "object";
        default:
            return s;
        }
    }
    exports.type_of = type_of;


    function trunc_string(str,n) {
        if ( str.length <= n )
            return str;
        return str.substring(0,n).trim() + '...';
    }
    exports.trunc_string = trunc_string;


    function pobj( a1, a2 ) 
    {
        if ( arguments.length > 1 )
        {
            this.name = a1;
            this.obj = a2;
        }
        else if ( arguments.length === 1 )
        {
            this.name = '';
            this.obj = a1;
        }
        else
            return undefined;


        var p = function(s) { console.log(s); };

        if ( arguments.length === 0 ) {
            return undefined;
        }

        var s = this.name + ' ['+ typeof(this.obj) + ']: ';
        s += JSON.stringify(this.obj);
        p( s );
        return s;
    }
    exports.pobj = pobj;


    function read_file( filename )
    {
        try {
            return fs.readFileSync( filename, {encoding:'utf8',flag:'r'} );
        }
        catch(e) {
            return null;
        }
    }
    exports.read_file = read_file;


    function write_file( filename, data, mode )
    {
        var _mode = mode || 0666;
        try {
            fs.writeFileSync( filename, data, {encoding:"utf8",mode:_mode,flag:'w'} );
            return 1;
        }
        catch(e) {
            return null;
        }
    }
    exports.write_file = write_file;


    function append_file( filename, data, mode )
    {
        var _mode = mode || 0666;
        try {
            fs.writeFileSync( filename, data, {encoding:"utf8",mode:_mode,flag:'a'} );
            return 1;
        }
        catch(e) {
            return null;
        }
    }
    exports.append_file = append_file;


    // takes an object and sorts it by its keys, alphabetically
    function sortObjectByKeys( O )
    {
        var keys = [];

        for ( i in O ) {
            if ( O.hasOwnProperty(i) ) {
                keys.push( {name:i,value:O[i]} );
            }
        }
        if ( keys.length === 0 )
            return {'__firstKey':null};

        keys.sort( function(a,b) { return a.name < b.name ? -1 : 1; } );
        
        var firstKey = null;

        var o = { '__firstKey': keys[0].name };

        keys.forEach( function(item) {
            o[item.name] = item.value;
        });

        return o;
    }
    exports.sortObjectByKeys = sortObjectByKeys;

    function list_dir( _dir ) 
    {
        function ls_dir ( dir_path, set )
        {
            try {
                var stat = fs.statSync( dir_path );
            } catch(e) {
                process.stderr.write( "error: \""+dir_path+'" not found' +"\n" );
                return null;
            }

            if ( !stat.isDirectory() )
                set.push( dir_path );
            else
            {  
                var dir = fs.readdirSync( dir_path );

                for ( var i = 0, l = dir.length ; i < l; i++ ) {
                    dir[i] = path.resolve( dir_path, dir[i] );

                    stat = fs.statSync( dir[i] );
                    if ( stat.isDirectory() )
                        ls_dir( dir[i], set );
                    else
                        set.push( dir[i] );
                }
            }
        }

        var set = [];
        ls_dir( path.resolve(_dir), set );
        return set;
    }
    exports.list_dir = list_dir;

/// expects callback() and space-separated string like an actual commandline
function system( callback, commandline )
{
  if ( arguments.length < 2 ) {
    process.stdout.write( 'stderr: ' + 'system() expects 2 arguments: callback(), "command"' );
    return;
  }

  var args = '';
  for ( var i = 1; i < arguments.length; i++ ) {
    if ( arguments[i] instanceof Array )
      args += ' ' + arguments[i].join(' ');
    else
      args += ' ' + arguments[i];
  }
  args = args.trim().split(/\s+/);

  var res = [];
  var spawn = require('child_process').spawn;
  var child = spawn( args[0], args.slice(1), { env: process.env });
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', function (data) {
    res.push( data );
  });

  child.stderr.on('data', function (data) {
    process.stdout.write( 'stderr: ' + data );
  });

  child.on('close', function (code) {
    //return callback( JSON.stringify(res) );
    return callback(res.join(' '));
  });
}
exports.system = system;
/*
var p = function(s) { process.stdout.write(s); };
system( p, 'ls -ltr' );
*/


function objEmpty(obj) {
  if ( Object && Object.keys )
    return Object.keys(obj).length === 0;
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}
exports.objEmpty = objEmpty;


})();


