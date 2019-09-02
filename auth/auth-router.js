const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const secrets = require("../config/secrets.js");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  // implement registration
  const hash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hash;

  Users.add(req.body)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  // implement login
  let { username, password } = req.body;
  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = genToken(user);
        res.status(200).json({ message: `Welcome ${username}`, token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => {
      res.status(500).json({ err: err.message });
    });
});

function genToken(user) {
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
