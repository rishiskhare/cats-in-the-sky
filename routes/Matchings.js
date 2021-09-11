const express = require('express');
const router = express.Router();
const axios = require('axios');

const Cat = require('../models/Cat');
const Vege = require('../models/Vege');
const ExcludedVege = require('../models/ExcludedVege');

const catsRaw = axios.get('http://cats-in-the-sky.herokuapp.com/api/cats');
const vegesRaw = axios.get('http://cats-in-the-sky.herokuapp.com/api/veges');


/*  This get request returns all of the pairings of cats and veges. The cats are retrieved from both the online API and the local cats to be added.
    The veges are retrieved from the online API and the local veges to be added, as well as filtering out the excluded veges.
*/
router.get('/', (req, res) => {
    let localCatsRaw = Cat.find({});
    let localVegesRaw = Vege.find({});
    let excludedVegesRaw = ExcludedVege.find({});
    Promise.all([catsRaw, localCatsRaw, localVegesRaw, vegesRaw, excludedVegesRaw]).then(([cats, localCats, localVeges, veges, excludedVeges]) => {
        let allVeges = filterVeges(veges.data, localVeges, excludedVeges);
        let allCats = getAllCats(cats.data, localCats)
        let matchings = matchCatsWithVeges(allCats, allVeges);
        res.send(matchings);
    });
});


/*  Non-destructive function which return an array of all cats after populating the cats array by adding the names of cats in localCats and the online API.
    Note: cats must be an array of vege names, localCats must be a collection of Vege objects
*/
function getAllCats(cats, localCats) {
    let allCats = [];
    for (let elem of cats) {
        allCats.push(elem);
    }
    for (let elem of localCats) {
        // Check if the cat is already in the cats array and if not, add it to allCats
        const cat = cats.find(c => c === elem.catName);
        if (!cat) {
            allCats.push(elem.catName);
        }
    }
    return allCats;
}

/*  Non-destructive function which return an array of all veges after populating the veges array by adding the names of veges in localVeges and the online API
    and filtering out the excluded values.
    Note: veges must be an array of vege names, localVeges must be a collection of Vege objects, excludedVeges must be a collection of excludedVege objects
*/
function filterVeges(veges, localVeges, excludedVeges) {
    let allVeges = [];
    for (let elem of veges) {
        allVeges.push(elem);
    }
    excludedVegesNames = [];
    for (let elem of excludedVeges) {
        excludedVegesNames.push(elem.vegeName);
    }
    allVeges = allVeges.filter((elem) => {
        return excludedVegesNames.indexOf(elem) < 0;
    });
    for (let elem of localVeges) {
        allVeges.push(elem.vegeName);
    }
    return allVeges;
}

/*  This get request returns the veges array for a given cat name by populating the matchings from the cats and veges.
    Similar to the other get request, the cats are retrieved from both the online API and the local cats to be added.
    The veges are retrieved from the online API and the local veges to be added, as well as filtering out the excluded veges.
*/
router.get('/:catName', (req, res) => {
    let localCatsRaw = Cat.find({});
    let localVegesRaw = Vege.find({});
    let excludedVegesRaw = ExcludedVege.find({});
    Promise.all([catsRaw, localCatsRaw, localVegesRaw, vegesRaw, excludedVegesRaw]).then(([cats, localCats, localVeges, veges, excludedVeges]) => {
        let allVeges = filterVeges(veges.data, localVeges, excludedVeges);
        let allCats = getAllCats(cats.data, localCats)
        let matchings = matchCatsWithVeges(allCats, allVeges);
        if (!(req.params.catName in matchings)) {
            res.status(404).send('The cat with the provided name is not found. Please try again.');
        }
        res.send(matchings[req.params.catName]);
    });
});

/*  The matchCatsWithVeges function takes in arrays of cats and veges (veges must be sorted)
    and returns a dictionary of (name, veges) pairs where name is a String value
    and veges is an array of Strings.
*/
function matchCatsWithVeges(catsInput, vegesInput) {
    // Dictionary to be returned which stores (name, veges) pairs
    let pairs = {};
    
    // Memoization: store starting letters as keys and veges as values in a cache dictionary to avoid redundant computation
    let cache = {};

    // Iterate through input cats array
    for (let cat of catsInput) {
        // If the starting letter is already cached, append cached value to the pairs dictionary
        let startingLetter = cat.charAt(0).toLowerCase();
        if (startingLetter in cache) {
            pairs[cat] = cache[startingLetter];
        }
        // Otherwise, populate the veges array for the letter and append to both the pairs and cache dictionaries
        else {
            // Populates and stores veges given a starting letter in vegesForCat
            let vegesForCat = getVeges(vegesInput, startingLetter)
            // Make new entry in pairs
            pairs[cat] = vegesForCat;
            // Cache the veges for future lookup
            cache[startingLetter] = vegesForCat;
        }
    }
    // Returns all (name, veges) pairs
    return pairs;
}


/*  The getVeges function generates an array of veges which share the same starting letter
    Note: startingLetter must be lowercase
*/
function getVeges(vegesInput, startingLetter) {
    let veges = [];
    for (let vege of vegesInput) {
        if (vege.charAt(0).toLowerCase() === startingLetter) {
            veges.push(vege);
        }
    }
    return veges;
}

module.exports = router;