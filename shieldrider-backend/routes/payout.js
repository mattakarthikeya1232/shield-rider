const express = require("express");
const router = express.Router();

const { processPayout } = require("../controllers/payoutController");

router.post("/process-payout", processPayout);

module.exports = router;