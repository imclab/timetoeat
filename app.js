
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var list = require('./routes/list');
var http = require('http');
var path = require('path');
var nano = require('nano');

var app = express();

GLOBAL.nano = nano(process.env.CLOUDANT_URL);
process.env.PWD = process.cwd();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(process.env.PWD, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(process.env.PWD, 'public')));
app.use(express.static(path.join(process.env.PWD, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', routes.index);
app.post('/', list.new);
app.get('/about', routes.about);
app.get('/:list', list.show);
app.post('/:list', list.add_food);
app.get('/:list/statistics', list.statistics);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
