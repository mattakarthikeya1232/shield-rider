const express = require("express");
const router = express.Router();

const { processClaim } = require("../controllers/claimController");

router.post("/claim", processClaim);

module.exports = router;
