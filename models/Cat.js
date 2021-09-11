const mongoose = require('mongoose');

const catsSchema = new mongoose.Schema({
    catName: String
});

module.exports = mongoose.model('Cat', catsSchema);
