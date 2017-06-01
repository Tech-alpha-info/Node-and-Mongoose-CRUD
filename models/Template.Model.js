var mongoose = require('mongoose');

var TemplateSchema = mongoose.Schema({
    name: String,
    category: String,
    created: Date,
    template: String
});

module.exports = mongoose.model('TemplateModel', TemplateSchema);