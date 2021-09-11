const express = require('express');
const app = express();
const axios = require('axios');

// Retrieve CRUD operations from routes folder
const cats = require('./routes/cats');
const veges = require('./routes/veges');
const Matchings = require('./routes/Matchings');

// Initialize routes
app.use(express.json());
app.use('/api/cats', cats);
app.use('/api/veges', veges);
app.use('/api/Matchings', Matchings);

// Establish connection to local catsDB MongoDB database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/catsDB')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Couldn\'t connect to MongoDB...', err));
;

// Welcome Page
app.get('/', (req, res) => {
    res.send('Welcome to Cats in the Sky! Our highly scientific studies showed us that milk was 87% ineffective for fenile health. That\'s why we believe in serving fresh vegetables to all our cats at high altitudes.')
});

// PORT either takes a user defined value or a default value of 3000
const PORT = process.env.PORT || 3000;
// Establish a connection to port at localhost:PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));