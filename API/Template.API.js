var express = require('express');
var router = express.Router();
var templateModel = require('../models/Template.Model');


/*
 * 
 *  Rest API calls - requests on these methods call in to the (mongoose) model which talks to Mongo DB.
 * 
 *  
 * /




/* Get all records */
router.get('/', function (req, res, next) {

    templateModel.find({}, function (err, data) {
        
        if (err) {
            res.json({ model: null, success: false, message: err.message });
         
        }
        else {
            //res.json({ model: null, success: false, message: 'test!' });
            res.json({ model: data, success: true });
        }

     
    });
});







/* Get a record by id */
router.get('/items/:id', function (req, res, next) {
    
    templateModel.find({ _id: req.params.id }, function (err, data) {
        
        if (err) {
            res.json({ model: null, success: false, message: err.message });
            //res.json(err.message);
        }
        else if (data.length === 0) {
            res.json({ message: 'An item with that id does not exist in this database.', success: false });          
        }
        else {
            res.json({ model: data, success: true });
            //res.send(data);
        }


    });
});




/* Update a record  */
router.put('/', function (req, res) {
    
    var id = { _id: req.body._id };
    var update = { name: req.body.name, category: req.body.category, template: req.body.template };
    var options = { new: true };
    
    console.log(id);

    templateModel.findOneAndUpdate(id, update, options, function (err, data) {
        if (err) {
            //next(err);
            res.json({ model: null, success: false, message: err.message });
        }
        else {
            res.json({ model: update.data, success: true });
            //res.json(update.data);
        }
    });

});





/* Delete a record */
router.delete('/:id', function (req, res, next) {
    
    templateModel.findOneAndRemove({ _id: req.params.id }, function (err, data) {
        if (err) {
            res.json({ message: err.message, success: false });
        }
        else if (data.length === 0) {
            res.json({ message: 'An item with that id does not exist in this database.', success: false });
        }
        else {
            res.json({ message: 'Success. Item deleted.', success: true });
        }
    });
});




/* Create a Record */ 
router.post('/', function (req, res, next) {
    
    var newtemplateModel = new templateModel({ name: req.body.name, category: req.body.category, created: new Date(), template: req.body.template  });
    
    console.log("New Record: " + newtemplateModel);
    
    templateModel.create(newtemplateModel, function (err, next) {
                if (err) {
                    res.json({ message: err.message, success: false });
                } else {
                    res.json({ model: newtemplateModel, success: true } );
                }

    });


});



module.exports = router;