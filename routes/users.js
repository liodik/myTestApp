const express = require("express");

const usersController = require("../controllers/users");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", usersController.users);

router.get("/me", isAuth, usersController.me);

module.exports = router;