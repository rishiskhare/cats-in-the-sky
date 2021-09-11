const mongoose = require('mongoose');

const vegesSchema = new mongoose.Schema({
    vegeName: String
});

module.exports = mongoose.model('Vege', vegesSchema);