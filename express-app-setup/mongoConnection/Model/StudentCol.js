const mongoose = require('mongoose');
// const schema = mongoose.Schema;
const conn = require('../mongoConnection/MongoConnection');

const studentSchema = new mongoose.Schema({

    name: {
        type: String
    },
    addess: {
        type: String
    }

});

module.exports = Student = conn.conn2.model("students", studentSchema);