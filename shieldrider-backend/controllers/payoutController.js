const processPayout = (req, res) => {
    res.json({
        amount: 200,
        status: "SUCCESS",
        message: "UPI transfer simulated"
    });
};

module.exports = { processPayout };