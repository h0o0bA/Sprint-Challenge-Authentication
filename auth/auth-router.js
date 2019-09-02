const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

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
        res.status(200).json({ message: `Welcome ${username}` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => {
      res.status(500).json({ err: err.message });
    });
});

module.exports = router;
