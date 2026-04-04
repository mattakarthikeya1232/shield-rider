// utils/fraudLogic.js

function calculateFraudScore(data) {
    let score = 100;
    let flags = [];

    // GPS check
    if (!data.gps) {
        score -= 40;
        flags.push("GPS_MISMATCH");
    }

    // Duplicate claim check
    if (data.duplicate === 1) {
        score -= 50;
        flags.push("DUPLICATE_CLAIM");
    }

    // GPS spoofing check
    if (data.spoof === 1) {
        score -= 30;
        flags.push("GPS_SPOOFING");
    }

    // Claim frequency check
    if (data.claim_count > 5) {
        score -= 20;
        flags.push("HIGH_CLAIM_FREQUENCY");
    }

    // Time gap check (too frequent claims)
    if (data.avg_gap < 2) {
        score -= 20;
        flags.push("LOW_TIME_GAP");
    }

    // Ensure score stays within 0–100
    if (score < 0) score = 0;

    return {
        score,
        flags
    };
}

// Decision logic
function getDecision(score) {
    if (score >= 75) return "APPROVED";
    if (score >= 40) return "REVIEW";
    return "REJECT";
}

module.exports = {
    calculateFraudScore,
    getDecision
};