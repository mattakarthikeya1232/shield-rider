const verifyPolicy = (req, res) => {
    const { gps, policy_active, duplicate } = req.body;

    if (!policy_active) {
        return res.json({ status: "INACTIVE_POLICY" });
    }

    if (duplicate === 1) {
        return res.json({ status: "REJECT_DUPLICATE" });
    }

    if (!gps) {
        return res.json({ status: "GPS_FAIL" });
    }

    res.json({ status: "VERIFIED" });
};

module.exports = { verifyPolicy };

const db = require('../database');

exports.registerUser = (req, res) => {
    const { name, email, password, plan } = req.body;

    db.run(
        `INSERT INTO users (name, email, password, plan) VALUES (?, ?, ?, ?)`,
        [name, email, password, plan],
        function(err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.send("User registered ✅");
        }
    );
};