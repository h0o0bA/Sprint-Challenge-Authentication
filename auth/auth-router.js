const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UsersDb = require("../users/users-model");
const secrets = require("../config/secrets.js");

router.post("/register", (req, res) => {
  // implement registration
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  UsersDb.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  // implement login
  let { username, password } = req.body;

  UsersDb.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({ message: `Welcome ${user.username}!`, token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error logging in!" });
    });
});

function generateToken(user) {
  const payload = {
    subject: "users",
    username: user.username
  };
  const secret = secrets.jwtSecret;
  const option = {
    expiresIn: "8h"
  };

  return jwt.sign(payload, secret, option);
}

module.exports = router;
