var mongoose = require('mongoose');
module.exports.conn1 = mongoose.createConnection('mongodb://localhost:27017/ProfileManager');
module.exports.conn2 = mongoose.createConnection('mongodb://localhost:27017/test');

