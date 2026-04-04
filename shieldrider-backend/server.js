const express = require("express");
const cors = require("cors");
const twilio = require("twilio");



// Routes
const fraudRoutes = require('./routes/fraud');

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api', fraudRoutes);



// =====================
// 🔥 CLAIM API (FIXED)
// =====================
app.post("/claim", (req, res) => {

    const fraud_score = Math.floor(Math.random() * 100);
    const isFraud = fraud_score > 70; // 🔥 threshold

    if (isFraud) {
        res.json({
            prediction: "Fraud",
            decision: "REVIEW",
            fraud_score: fraud_score,
            payout: 0
        });
    } else {
        const amount = Math.floor(Math.random() * 5000) + 500;

        res.json({
            prediction: "Legit",
            decision: "APPROVE",
            fraud_score: fraud_score,
            payout: amount
        });
    }
});



// =====================
// 📩 TWILIO SETUP
// =====================
const accountSid = "ACxxxxxxxxxxxxxxxxxxxx"; // replace
const authToken = "xxxxxxxxxxxxxxxxxxxx";   // replace

const client = new twilio(accountSid, authToken);



// =====================
// 📱 WHATSAPP API
// =====================
app.post("/send-message", async (req, res) => {
    const { phone, amount, status } = req.body;

    let message = "";

    if (status === "FRAUD BLOCKED") {
        message = "🚨 Fraud detected. Transaction blocked. ₹0 credited.";
    } else {
        message = `✅ ₹${amount} credited successfully.`;
    }

    try {
        await client.messages.create({
            body: message,
            from: "whatsapp:+14155238886",
            to: `whatsapp:+91${phone}`
        });

        res.send("Message sent ✅");
    } catch (err) {
        console.error("Twilio Error:", err.message);
        res.status(500).send("Error sending message ❌");
    }
});



// =====================
// 🧑 REGISTER API (DB)
// =====================
app.post('/register', (req, res) => {
    const { name, email, password, plan } = req.body;

    res.json({
        message: "User registered ✅",
        user: { name, email, plan }
    });
});



// =====================
// 🧪 TEST ROUTE
// =====================
app.get('/test-api', (req, res) => {
    res.send("API working ✅");
});



// =====================
// 🚀 START SERVER
// =====================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});