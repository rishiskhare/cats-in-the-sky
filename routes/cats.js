const express = require("express");
const router = express.Router();
const axios = require("axios");
const Cat = require("../models/Cat");

const catsRaw = axios.get("http://cats-in-the-sky.herokuapp.com/api/cats");

/*  This post method puts a new entry into the cats collection of the database
with the same name as the name provided. If a name isn't provided, catch and display an error
*/
router.post("/", (req, res) => {
  const cat = new Cat({
    catName: req.body.cat,
  });
  // If catName is undefined, send a 404 error
  if (!cat.catName) {
    return res
      .status(404)
      .send(
        "Uh oh! A cat name was not provided. Please check that you spelled 'cat' correctly"
      );
  }

  // Get the values for the cats stored locally
  let localCatsRaw = Cat.find({});
  Promise.all([catsRaw, localCatsRaw]).then(([cats, localCats]) => {
    // Check if cat is in the online API cats data
    for (elem in cats.data) {
      if (elem === cat.catName) {
        return res
          .status(404)
          .send(cat.catName + " already exists in the online API");
      }
    }

    // Check if the cat has already been added
    const newCatInLocal = localCats.find((c) => c.catName === cat.catName);

    // If a cat already exists with the same name, give an message to the user
    if (newCatInLocal) {
      return res.send(cat.catName + " has already been added");
    }
    // Otherwise, save the cat in the local cats collection
    cat
      .save()
      .then((cat) => {
        return res.send(cat);
      })
      .catch((err) => {
        return res
          .status(404)
          .send("Uh oh! Error occurred while trying to get cats");
      });
  });
});

/*  This get method gets all of the cats from both the online API and the local cats
 */
router.get("/", (req, res) => {
  let localCatsRaw = Cat.find({});
  Promise.all([catsRaw, localCatsRaw]).then(([cats, localCats]) => {
    for (let elem of localCats) {
      // Check if the cat is already in the veges array
      const cat = cats.data.find((c) => c === elem.catName);
      if (!cat) {
        cats.data.push(elem.catName);
      }
    }
    res.send(cats.data);
  });
});

module.exports = router;
