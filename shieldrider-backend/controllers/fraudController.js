const axios = require('axios');

const checkFraud = async (req, res) => {
    try {
        console.log("Incoming Request:", req.body);

        const {
            duplicate,
            policy_active,
            spoof,
            claim_count,
            avg_gap,
            lat,
            lon
        } = req.body;

        // Call Python ML API
        const response = await axios.post('http://127.0.0.1:5000/predict', {
            duplicate,
            policy_active,
            spoof,
            claim_count,
            avg_gap,
            lat,
            lon
        });

        console.log("ML Response:", response.data);

        res.json(response.data);

    } catch (error) {
        console.error("ML ERROR:", error.message);

        res.status(500).json({
            error: "ML integration failed ❌"
        });
    }
};

module.exports = {
    checkFraud
};