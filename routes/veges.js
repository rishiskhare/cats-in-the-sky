const express = require("express");
const router = express.Router();
const axios = require("axios");
const Vege = require("../models/Vege");
const ExcludedVege = require("../models/ExcludedVege");

const vegesRaw = axios.get("http://cats-in-the-sky.herokuapp.com/api/veges");

/*  The post method uploads a vege added by the user to the veges collection of the database
 */
router.post("/", (req, res) => {
  const newVege = new Vege({
    vegeName: req.body.vege,
  });

  // Get the values for the veges stored locally
  let localVegesRaw = Vege.find({});
  let excludedVegesRaw = ExcludedVege.find({});
  Promise.all([vegesRaw, localVegesRaw, excludedVegesRaw]).then(
    ([veges, localVeges, excludedVeges]) => {
      const vege = new Vege({
        vegeName: req.body.vege,
      });

      // If vegeName is undefined, send a 404 error
      if (!vege.vegeName) {
        return res
          .status(404)
          .send(
            "Uh oh! A vege name was not provided. Please check that you spelled 'vege' correctly"
          );
      }

      // Check if the vege has already been added
      const newVegeInLocal = localVeges.find(
        (v) => v.vegeName === vege.vegeName
      );

      // If a vege already exists with the same name, give an error to the user
      if (newVegeInLocal) {
        return res.send(vege.vegeName + " has already been added");
      }

      // If the vege is found in the online API veges data, add the vege as an entry to the vegesExcluded table
      const excludedVege = new ExcludedVege({
        vegeName: req.body.vege,
      });

      // Check if the vege is in the excluded collection
      const newVegeInExcluded = excludedVeges.find(
        (v) => v.vegeName === excludedVege.vegeName
      );

      // If a vege already exists in the excluded collection, remove it from the excluded collection
      if (newVegeInExcluded) {
        // Remove the value from teh excluded collection
        const index = excludedVeges.indexOf(newVegeInExcluded);
        excludedVeges.splice(index, 1);
        return res.send(excludedVeges);
      }
      // Otherwise, save the value as a new value in the veges collection
      vege
        .save()
        .then((vege) => {
          res.send(vege);
        })
        .catch((err) => {
          res.send("Uh oh! Error occured while trying to save to veges");
        });
    }
  );
});

/*  This delete function removes a vege from our API. If the vege is in the online API, append the vege to an excludedVeges table in the local database.
Otherwise, check if the vege is in the local veges (veges which the user added) and remove it.
*/
router.delete("/", (req, res) => {
  // Get the values for the veges stored locally and the veges to be excluded
  let localVegesRaw = Vege.find({});
  let excludedVegesRaw = ExcludedVege.find({});
  Promise.all([vegesRaw, localVegesRaw, excludedVegesRaw]).then(
    ([veges, localVeges, excludedVeges]) => {
      // Create object and verify that a name was given.
      const excludedVege = new ExcludedVege({
        vegeName: req.body.vege,
      });
      if (!excludedVege.vegeName) {
        return res.send(
          "Uh oh! You didn't include a vege name... Make sure you spelled 'vege' correctly"
        );
      }

      // Check if vege is in the online API veges data
      const onlineVege = veges.data.find((v) => v === req.body.vege);

      // If the vege is not in the online API veges data, see if it is in the localVeges table
      if (!onlineVege) {
        const localVege = localVeges.find((v) => v.vegeName === req.body.vege);

        // If not in both online API veges data and vegesExcluded folder, send a 404 error (not found) and return
        if (!localVege) {
          return res
            .status(404)
            .send(
              "Uh oh! The vege with the provided name is not found... Please try again"
            );
        }

        // Otherwise, remove the vege from the local veges table and return
        const index = localVeges.indexOf(localVege);
        localVeges.splice(index, 1);
        localVege
          .remove({ vegeName: localVege.vegeName })
          .then((vege) => {
            return res.send(localVege);
            // If an error is caught while adding the entry to the database, return the error
          })
          .catch((err) => {
            return res.send("Uh oh! Error occured while uploading to database");
          });
      }
      // If the vege is found in the online API veges data, add the vege as an entry to the vegesExcluded table
      const newExcludedVege = excludedVeges.find(
        (v) => v.vegeName === excludedVege.vegeName
      );

      // If already in the excludedveges collection, send a message
      if (newExcludedVege) {
        return res.send(
          newExcludedVege.vegeName + " already exists in the excluded veges"
        );
      }

      excludedVege
        .save()
        .then((vege) => {
          return res.send(vege);

          // If an error is caught while adding the entry to the database, return the error
        })
        .catch((err) => {
          res.send("Uh oh! Error occured while uploading to database: ");
        });
    }
  );
});

/*  This get request retrieves all the veges from both the online API and the local veges (which the user added), and filters out the veges to be excluded
 */
router.get("/", (req, res) => {
  let localVegesRaw = Vege.find({});
  let excludedVegesRaw = ExcludedVege.find({});
  Promise.all([vegesRaw, localVegesRaw, excludedVegesRaw]).then(
    ([veges, localVeges, excludedVeges]) => {
      // Retrieve all veges from online API data
      allVeges = [];
      for (let elem of veges.data) {
        allVeges.push(elem);
      }
      for (let elem of localVeges) {
        // Check if the vege is already in the veges array
        const vege = veges.data.find((v) => v === elem.vegeName);
        if (!vege) {
          allVeges.push(elem.vegeName);
        }
      }
      // Find the excluded veges and remove them from veges data
      excludedVegesNames = [];
      for (let elem of excludedVeges) {
        excludedVegesNames.push(elem.vegeName);
      }
      allVeges = allVeges.filter((elem) => {
        return excludedVegesNames.indexOf(elem) < 0;
      });
      // Retrieve all the veges and return
      return res.send(allVeges);
    }
  );
});

module.exports = router;
