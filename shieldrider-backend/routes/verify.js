const express = require("express");
const router = express.Router();

const { verifyPolicy } = require("../controllers/verifyController");

router.post("/verify-policy", verifyPolicy);

module.exports = router;