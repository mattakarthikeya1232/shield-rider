const triggerEvent = (req, res) => {
    res.json({
        type: "RAIN",
        message: "Trigger detected from weather API"
    });
};

module.exports = { triggerEvent };