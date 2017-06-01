var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config');



// Routes resources
var index = require('./routes/index');
var editTemplate = require('./routes/edit');
var templateApi = require('./api/template.api');



// Express set up
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');






// Set up DB...
var MongoDB = mongoose.connect(config.DBURL).connection;
MongoDB.on('error', function (err) {
  if (err) {
    console.log('mongodb connection error', err);
  } else {
    console.log('mongodb connection successful');
  }
});



MongoDB.once('open', function () {
  console.log('mongodb connection open');
});






//var util = require('util');
//console.log(util.inspect(anyObject)); // Will give you more details than console.log




// Modules set up
if (config.Environment == 'production') {
    app.use(logger('common', { skip: function (req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else {
    app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Root
global.appRoot = path.resolve(__dirname);







// set up routes
app.use(express.static('public'));
app.use('/', index);
app.use('/Edit', editTemplate);
app.use('/templateManagerApi', templateApi);








// error handlers

// development error handler
// will print stacktrace
if (config.Environment === 'DEV') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.send(err.message);
});



// Start Server
var server = app.listen(config.Port, function(){
  var port = server.address().port;
  console.log('Listening on port: ', port);
});



module.exports = app;