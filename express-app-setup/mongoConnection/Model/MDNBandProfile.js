const mongoose = require('mongoose');
// const schema = mongoose.Schema;
const conn = require('../mongoConnection/MongoConnection');

const studentSchema = new mongoose.Schema({

    mdn: {
        type: String
    },
    dbcid: {
        type: String
    }

});

module.exports = MDNBandProfile = conn.conn2.model("MDNBandProfile", studentSchema);