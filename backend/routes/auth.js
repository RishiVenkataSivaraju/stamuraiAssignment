const express = require("express");
const passport = require("passport"); 

const User = require("../Schemas/UserSchema");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).send("User already exists");

    const newUser = new User({ username, password });
    await newUser.save();
    res.send("User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("Logged in successfully");
});


module.exports = router;
