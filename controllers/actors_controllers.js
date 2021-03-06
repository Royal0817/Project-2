const express = require("express");
const router = express.Router();
const db = require("../models");
const mongoose = require("mongoose");

// index route
router.get("/", async (req, res, next) => {
  try {
    const allActors = await db.Actor.find({});
    const context = { allActors };
    return res.render("actors/index.ejs", context);
  } catch (erro) {
    console.log(error);
    req.error = error;
    return next();
  }
});

// new route
router.get("/new", async (req, res, next) => {
  try {
    const allMovies = await db.Movie.find({});
    const context = { movies: allMovies };
    res.render("actors/new.ejs", context);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

// create route
router.post("/", async (req, res, next) => {
  try {
    let array = [];
    for (let i = 0; i < 10; i++) {
        let existingMovieId = await db.Movie.exists({ name: req.body.movies[i] });
        const newMovieData = {
            name: req.body.movies[i],
            actors: [req.params.id]
          };
      if (!existingMovieId && req.body.movies[i] !== '') {
        const newMovie = await db.Movie.create(newMovieData);
        array.push(newMovie.name);
      } else if (req.body.movies[i] === ''){
        console.log('----- Movie is empty -----')
      } else {
        array.push(req.body.movies[i]);
      }
    }
    for (let i = 0; i < array.length; i++) {
        let newId = await db.Movie.find({name: array[i]})
        console.log("LAST 1 " + array[i])
        array[i] = newId[0]._id
      }
    const newActorData = {
      name: req.body.name,
      age: req.body.age,
      image: req.body.image,
      hometown: req.body.hometown,
      movies: array,
    };
  const newActor = await db.Actor.create(newActorData);
  res.redirect(`/actors/${newActor._id}`);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

// show route
router.get("/:actorId", async (req, res, next) => {
  try {
    const foundActor = await db.Actor.findById(req.params.actorId).populate(
      "movies"
    );
    res.render("actors/show.ejs", { actor: foundActor });
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

// update route
router.put("/:id", async (req, res, next) => {
  try {
    let array = [];
    for (let i = 0; i < 10; i++) {
      let existingMovieId = await db.Movie.exists({ name: req.body.movies[i] });
      const newMovieData = {
        name: req.body.movies[i],
        actors: [req.params.id]
      };
      console.log(existingMovieId)
      if (!existingMovieId && req.body.movies[i] !== '') {
      let createdMovieId = await db.Movie.create(newMovieData);
        array.push(createdMovieId.name);
    } else if (req.body.movies[i] === ''){
      console.log('----- Movie is empty -----')
    } else {
      array.push(req.body.movies[i]);
    }
}
  for (let i = 0; i < array.length; i++) {
  let newId = await db.Movie.find({name: array[i]})
  console.log("each" + newId[i])
  array[i] = newId[0]._id
}
  await db.Actor.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    age: req.body.age,
    image: req.body.image,
    hometown: req.body.hometown,
    movies: array
});
res.redirect(`/actors/${req.params.id}`)
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

// edit route
router.get("/:id/edit", async (req, res, next) => {
  try {
    const updatedActor = await db.Actor.findById(req.params.id);
    const context = { actor: updatedActor };
    res.render("actors/edit.ejs", context);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

// delete route
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedActor = await db.Actor.findByIdAndDelete(req.params.id);
    res.redirect(`/actors/`);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

module.exports = router;
