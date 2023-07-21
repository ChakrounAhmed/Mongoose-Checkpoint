const express = require("express");
const router = express.Router();
const Person = require("../Models/person");

//Creating and saving a new person
router.post("/newPerson", (req, res) => {
  let newPerson = new Person(req.body);
  newPerson.save((err, person) => {
    if (err) {
      res.send(err);
    }
    res.send(person);
  });
});

//Creating many records
router.post("/manyPersons", (req, res) => {
  let manyPersons = Person.create(req.body);
  manyPersons
    .then((persons) => {
      console.log(persons);
      res.send(persons);
    })
    .catch((err) => {
      res.send({ msg: err.message });
    });
});

//finding person by name
router.get("/person/:person", (req, res) => {
  Person.find({ name: req.params.person })
    .exec()
    .then((docs) => {
      if (docs[0]) {
        res.json(docs);
      } else res.send("Person not found!");
    });
});

//finding person by favorite food
router.get("/food/:food", (req, res) => {
  Person.findOne({ favoriteFoods: req.params.food }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result) {
        res.json(result);
      } else res.send(`we dont have person who like ${req.params.food}`);
    }
  });
});

//finding person by id
router.get("/id/:id", (req, res) => {
  Person.findById({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.send("Person not found", err);
    } else {
      res.json(data);
    }
  });
});

//Performing Classic Updates by running Finf,Edit and Save
function addHamburger(food) {
  let test = false;
  food.map((el) => {
    if (el.toLowerCase() === "hamburger") {
      test = true;
      return food;
    } else {
      food.push("Hamburger");
      return food;
    }
  });
}
router.put("/updateFood/:id", (req, res) => {
  Person.findById({ _id: req.params.id }, (err, result) => {
    if (err) res.send("error", err);
    else {
      addHamburger(result.favoriteFoods);
      result.save((err) => {
        if (err) console.error("error!");
      });
      res.send(result);
    }
  });
});

//Performing new updates on a document using model.finOneAndUpdate()
router.put("/updateAge/:name", (req, res) => {
  Person.findOneAndUpdate(
    { name: req.params.name },
    { age: 20 },
    { new: true, useFindAndModify: false }
  ).then((docs) => res.send(docs));
});

//Finding all persons
router.get("/", (req, res) => {
  Person.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => res.send(err));
});

//Deleting person
router.delete("/delete/:id", (req, res) => {
  Person.findByIdAndRemove({ _id: req.params.id }, (err, result) => {
    if (err) {
      res.send("error!", err);
    } else {
      res.send(`Deleted person: ${result}`);
    }
  });
});

//MongoDB and Mongoose-Deleteing many documents
router.delete("/deleteMary", (req, res) => {
  Person.deleteMany({ name: "Mary" }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      // Check if any documents were deleted
      if (result.deletedCount > 0) {
        res.send(`Deleted ${result.deletedCount} person(s) named Mary`);
      } else {
        res.send("No person named Mary found for deletion");
      }
    }
  });
});

//Chain searching query helpers to narrow search results
router.get("/burrito", (req, res) => {
  Person.find({ favoriteFoods: "burrito" })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: false })
    .exec((err, data) => {
      if (err) {
        res.send(err);
      } else {
        if (!data[0]) {
          res.send("There is no person who like burrito");
        } else res.send(data);
      }
    });
});

module.exports = router;
