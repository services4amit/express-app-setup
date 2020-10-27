const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({

    name: {
        type: String
    },
    addess: {
        type: String
    }

});

module.exports = Student = mongoose.model("students", studentSchema);