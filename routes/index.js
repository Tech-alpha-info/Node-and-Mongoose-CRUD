var express = require('express');
var router = express.Router();
var path = require('path');
//var logger = require('morgan');
//var config = require('./config');

// Modules set up
//if (config.Environment == 'production') {
//    express.use(logger('common', { skip: function (req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
//} else {
//    express.use(logger('dev'));
//}




// Return a view
router.get('/', function(req, res, next) {
  var index = path.join(__dirname, '../public/views/index.html');
  res.sendFile(index);
});



module.exports = router;