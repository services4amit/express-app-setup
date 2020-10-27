const mongoose = require('mongoose');
// const schema = mongoose.Schema;
const conn = require('../mongoConnection/MongoConnection');

const st = new mongoose.Schema({

    mdn: {
        type: String
    }
});

module.exports = Temp = conn.conn1.model("blacklists", st);