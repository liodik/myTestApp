const express = require("express");

const usersController = require("../controllers/users");

const router = express.Router();

router.get("/", usersController.users);

module.exports = router;