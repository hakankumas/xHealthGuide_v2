const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api");

router.post("/login", apiController.login);
module.exports = router;
