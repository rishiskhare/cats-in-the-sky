# Rishi Khare - Cats in the Sky

## Introduction

Welcome to Cats in the Sky! Our highly scientific studies showed us that milk was 87% ineffective for feline health. Additionally, high altitudes are shown to improve digestion patterns for cats especially. That's why we believe in serving fresh vegetables to all our cats at VERY high altitudes.

I have used the NodeJS framework for this project, and I stored the cats and veggies in a local MongoDB database. I've included some brief documentation below, though I've commented the logic within all of the files pretty thoroughly for specifics.

## Database organization

The MongoDB database is comprised of three collections:

1. cats - store the cats which have been added by the user
2. veges - stores the veggies which have been added by the user
3. excludedveges - stores the veges from the online API (http://cats-in-the-sky.herokuapp.com/api/veges) to be excluded when populating the list of veges

Note: The cats and veges collections are used to store only the values stored by the user, and do not include values from the online APIs

## Project structure

In this project, the main file to run is the app.js file. The folder has two additional directories, routes and models. Routes include the three routes in this project, '/api/cats', '/api/veges', and '/api/Matchings'. In app.js, I import these modules in order to unclutter the main app.js file. Additionally, the models folder contains all of the classes for the Cat, Vege, and ExcludedVege, and these are imported in the route files in order to enter data into the collections in the database.

The Cat model has a catName attribute, which is its name provided by the user, and similarly the Vege and ExcludedVege models both have vegeName attributes which are the name of the vege provided by the user.

## API Doc

Here are the main tasks the API can handle:

1. Get a list of matchings combining names of our cats and the veggies which share their first initial
2. Post a new cat or vege to the local MongoDB database
3. Delete a vege from the local MongoDB database
   ![CRUDOperations](./CRUDOperations.jpg?raw=true "CRUDOperations")

### /api/Matchings ('GET')

Access a dictionary of matchings of the cats' names and the veggies with the same first letter of their name using the '/api/matchings' query.

This would be the result of the call performed on the provided online API data:

```
{
    "Michael": [
        "Mallow",
        "Melokhia",
        "Mustard"
    ],
    "Christopher": [
        "Cabbage",
        "Celtuce",
        "Corn"
    ],
    "Jessica": [],
    "Matthew": [
        "Mallow",
        "Melokhia",
        "Mustard"
    ],
    "Ashley": [
        "Amaranth",
        "Arugula"
    ],
    "Jennifer": [],
    "Joshua": [],
    "Amanda": [
        "Amaranth",
        "Arugula"
    ],
    "Daniel": [],
    "David": [],
    "James": [],
    "Robert": [
        "Radicchio",
        "Rapini"
    ],
    "John": [],
    "Joseph": [],
    "Andrew": [
        "Amaranth",
        "Arugula"
    ],
    "Ryan": [
        "Radicchio",
        "Rapini"
    ],
    "Brandon": [
        "Broccoli"
    ],
    "Jason": [],
    "Justin": [],
    "Sarah": [
        "Samphire",
        "Spinach"
    ],
    "William": [
        "Watercress"
    ],
    "Jonathan": [],
    "Stephanie": [
        "Samphire",
        "Spinach"
    ],
    "Brian": [
        "Broccoli"
    ],
    "Nicole": [],
    "Nicholas": [],
    "Anthony": [
        "Amaranth",
        "Arugula"
    ],
    "Heather": [],
    "Eric": [],
    "Elizabeth": [],
    "Adam": [
        "Amaranth",
        "Arugula"
    ],
    "Megan": [
        "Mallow",
        "Melokhia",
        "Mustard"
    ],
    "Melissa": [
        "Mallow",
        "Melokhia",
        "Mustard"
    ],
    "Kevin": [
        "Kale"
    ],
    "Steven": [
        "Samphire",
        "Spinach"
    ],
    "Thomas": [
        "Turnip"
    ],
    "Timothy": [
        "Turnip"
    ],
    "Christina": [
        "Cabbage",
        "Celtuce",
        "Corn"
    ],
    "Kyle": [
        "Kale"
    ],
    "Rachel": [
        "Radicchio",
        "Rapini"
    ],
    "Laura": [
        "Lettuce"
    ],
    "Lauren": [
        "Lettuce"
    ],
    "Amber": [
        "Amaranth",
        "Arugula"
    ],
    "Brittany": [
        "Broccoli"
    ],
    "Danielle": [],
    "Richard": [
        "Radicchio",
        "Rapini"
    ],
    "Kimberly": [
        "Kale"
    ],
    "Jeffrey": [],
    "Amy": [
        "Amaranth",
        "Arugula"
    ],
    "Crystal": [
        "Cabbage",
        "Celtuce",
        "Corn"
    ],
    "Michelle": [
        "Mallow",
        "Melokhia",
        "Mustard"
    ]
}
```

### /api/Matchings/:catName ('GET')

Access an array of the veggies corresponding to a particular cat with the provided name of catName

Example: /api/Matchings/Michelle ('GET')

```
[
    "Mallow",
    "Melokhia",
    "Mustard"
]
```

### /api/cats (`GET`)

Access all of the cats by taking all of the cats from the online API (http://cats-in-the-sky.herokuapp.com/api/cats) and adding the names of the cats locally stored in the cats array

Result of calling /api/cats on provided online API data:

```
[
    "Michael",
    "Christopher",
    "Jessica",
    "Matthew",
    "Ashley",
    "Jennifer",
    "Joshua",
    "Amanda",
    "Daniel",
    "David",
    "James",
    "Robert",
    "John",
    "Joseph",
    "Andrew",
    "Ryan",
    "Brandon",
    "Jason",
    "Justin",
    "Sarah",
    "William",
    "Jonathan",
    "Stephanie",
    "Brian",
    "Nicole",
    "Nicholas",
    "Anthony",
    "Heather",
    "Eric",
    "Elizabeth",
    "Adam",
    "Megan",
    "Melissa",
    "Kevin",
    "Steven",
    "Thomas",
    "Timothy",
    "Christina",
    "Kyle",
    "Rachel",
    "Laura",
    "Lauren",
    "Amber",
    "Brittany",
    "Danielle",
    "Richard",
    "Kimberly",
    "Jeffrey",
    "Amy",
    "Crystal",
    "Michelle"
]
```

### /api/cats (`POST`)

Add a new cat to the cats collection if and only if the cat does not already exist in either the online API data and the cat has not already been added previously to the cats collection of the database. If the user accidentally misspells 'vege' in the input, a message is displayed.

Input should look like:

```
{
  "cat": "Alice"
}
```

### /api/veges ('GET')

Access all of the veggies by taking all of the veggies from the online API (http://cats-in-the-sky.herokuapp.com/api/veges) and removing the names of cats to be excluded stores in the excludedCats collection.

This is the result of the get query on the provided online API data:

```
[
    "Amaranth",
    "Arugula",
    "Broccoli",
    "Cabbage",
    "Celtuce",
    "Corn",
    "Fiddlehead",
    "Grape Leaves",
    "Kale",
    "Lettuce",
    "Mallow",
    "Melokhia",
    "Pea",
    "Radicchio",
    "Rapini",
    "Samphire",
    "Spinach",
    "Turnip",
    "Watercress",
    "Orange",
    "O",
    "Hello"
]
```

### /api/veges ('POST')

If the vege already exists in the excludedVeges collection, remove it from the excludedVeges collection so that the get query will populate the vege from the online API. If not, add a new vege to the veges collection if the vege does not already exist in the veges collection. If the user accidentally misspells 'vege' in the input, a message is displayed.

Input should look like:

```
{
  "vege": "Green Beans"
}
```

### Final note:

I found it amusing that the premise of the client was so imaginative and not a just a typical "build an API to fetch the users of our website". It was pretty fun writing the code for the Matchings file especially. In order to perform the matchings, I stored the veggies for each letter in a dictionary by caching the result of each cat in order to make for a speedier solution. I'm sure there are parts of the code which can be made cleaner and faster, though I tried my best to make a functional project. I also didn't get to the optional user authentication assignment against evil cats.
Feel free to reach out through my email (rishi.khare@berkeley.edu) if you have any questions about the implementation.
