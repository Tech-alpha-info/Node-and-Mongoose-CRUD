
/* node.js - Equivalent to a config file  */

var config = {};

config.Port = 3000;
config.Environment = 'DEV';
config.Host = 'localhost';
config.DBURL = 'mongodb://localhost:27017/TemplateManager';



module.exports = config;