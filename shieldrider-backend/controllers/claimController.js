const processClaim = (req, res) => {
    const { gps, duplicate } = req.body;

    if (duplicate === 1) {
        return res.json({ decision: "REJECT", reason: "Duplicate claim" });
    }

    const response = {
        trigger: true,
        gps_verified: gps,
        fraud_score: 90,
        decision: "APPROVED",
        payout: 200
    };

    res.json(response);
};

module.exports = { processClaim };

const db = require('../database');