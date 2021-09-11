const mongoose = require('mongoose');

const vegesExcludedSchema = new mongoose.Schema({
    vegeName: String
});

module.exports = mongoose.model('ExcludedVege', vegesExcludedSchema);