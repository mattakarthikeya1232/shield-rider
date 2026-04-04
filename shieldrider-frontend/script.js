// 🔐 CHECK LOGIN
window.onload = function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "welcome.html";
        return;
    }

    if (user) {
        document.getElementById("username").innerText = "👤 " + user.name;
    }

    getLocation();
};

// 📍 LOCATION
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            document.getElementById("coords").innerText =
                "Lat: " + lat.toFixed(4) + " | Lon: " + lon.toFixed(4);

            let user = JSON.parse(localStorage.getItem("user")) || {};
            user.coords = lat + ", " + lon;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );
                const data = await res.json();

                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    data.address.state ||
                    "Unknown";

                user.city = city;
                localStorage.setItem("user", JSON.stringify(user));

                document.getElementById("userCity").innerText = "📍 " + city;
            } catch {
                document.getElementById("userCity").innerText = "📍 Location error";
            }
        }, () => {
            document.getElementById("userCity").innerText = "📍 Permission denied";
        });
    }
}

// ⏱️ DELAY
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 📲 WHATSAPP FUNCTION
function sendWhatsApp(phone, amount, status) {
    fetch("https://shield-rider.onrender.com/send-message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            phone,
            amount,
            status
        })
    })
        .then(res => res.text())
        .then(data => console.log("WhatsApp:", data))
        .catch(err => console.error("Error:", err));
}

// 🚀 CLAIM FLOW
async function triggerClaim() {
    const result = document.getElementById("result");
    const notif = document.getElementById("notification");

    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "User",
        phone: ""
    };

    try {
        const response = await fetch("https://shield-rider.onrender.com/claim", {
            method: "POST"
        });

        async function checkFraud() {
    const data = {
        duplicate: 0,
        policy_active: 1,
        spoof: 0,
        claim_count: 2,
        avg_gap: 5,
        lat: 13.08,
        lon: 80.27
    };

    try {
        const res = await fetch('https://shield-rider.onrender.com/api/check-fraud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // 🔥 HANDLE ERROR
        if (!res.ok) {
            throw new Error("Server error");
        }

        const result = await res.json();

        document.getElementById("result").innerHTML = `
            <h3>Result:</h3>
            <p>Prediction: ${result.prediction || "N/A"}</p>
            <p>Confidence: ${result.confidence || "N/A"}</p>
            <p>Decision: ${result.decision || "N/A"}</p>
        `;

    } catch (err) {
        console.error(err);

        document.getElementById("result").innerHTML = `
            <h3 style="color:red;">⚠️ Error</h3>
            <p>Fraud service unavailable</p>
        `;
    }
}

        // 🔴 FRAUD CASE
        if (data.prediction === "Fraud" || data.decision === "REVIEW") {

            result.innerHTML = `
                <h3 style="color:red;">🚨 FRAUD DETECTED</h3>
                <p>❌ Transaction Blocked</p>
                <p>📊 Risk Score: ${data.fraud_score || data.confidence || "N/A"}</p>
            `;

            notif.innerHTML = `
                🚫 ₹0 credited. Fraud transaction prevented, ${user.name}!
            `;

            // Optional alert (good for demo 🔥)
            alert("🚨 Fraud detected! Transaction blocked.");

            // WhatsApp alert (send 0 amount)
            if (user.phone && confirm("Send WhatsApp alert?")) {
                sendWhatsApp(user.phone, 0, "FRAUD BLOCKED");
            }

        }
        // 🟢 SAFE CASE
        else {

            result.innerHTML = `
                <h3 style="color:lightgreen;">✅ APPROVED</h3>
                <p>📊 Score: ${data.fraud_score || data.score || 36}</p>
                <p>💰 ₹${data.payout}</p>
            `;

            notif.innerHTML = `
                💰 ₹${data.payout} credited. Stay safe, ${user.name}!
            `;

            if (user.phone && confirm("Send WhatsApp alert?")) {
                sendWhatsApp(user.phone, data.payout, "APPROVED");
            }
        }

    } catch (err) {
        console.error(err);
        result.innerText = "❌ Error processing claim";
    }
}

// 🧪 SIMULATE BUTTON
function simulateTransaction() {
    triggerClaim();
}

// 🚪 LOGOUT
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "welcome.html";
}

// 🤖 ML FRAUD CHECK
async function checkFraud() {
    const data = {
        duplicate: 0,
        policy_active: 1,
        spoof: 0,
        claim_count: 2,
        avg_gap: 5,
        lat: 13.08,
        lon: 80.27
    };

    try {
        const res = await fetch('https://shield-rider.onrender.com/api/check-fraud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        document.getElementById("result").innerHTML = `
            <h3>Result:</h3>
            <p>Prediction: ${result.prediction}</p>
            <p>Confidence: ${result.confidence}</p>
            <p>Decision: ${result.decision}</p>
        `;

    } catch (err) {
        console.error(err);
        alert("Error connecting to ML ❌");
    }
}
