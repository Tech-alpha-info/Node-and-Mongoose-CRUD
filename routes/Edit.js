var express = require('express');
var router = express.Router();
var path = require('path');



// Return the edit form view
router.get('/', function(req, res, next) {
  var editfile = path.join(__dirname, '../public/views/edit.html');
  res.sendFile(editfile);
});



module.exports = router;