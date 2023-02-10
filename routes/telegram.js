const express = require("express");

const telegramController = require("../controllers/messengers/telegram");

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post("/login", isAuth, telegramController.login);

router.get("/chats/:messengerId", telegramController.getChats);

module.exports = router;
