const express = require("express");
const router = express.Router();

const { triggerEvent } = require("../controllers/triggerController");

router.post("/trigger-event", triggerEvent);

module.exports = router;