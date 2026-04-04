from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from shapely.geometry import Point, Polygon

app = Flask(__name__)

# Zone
zone_coords = [
    (13.00, 80.10),
    (13.20, 80.10),
    (13.20, 80.30),
    (13.00, 80.30)
]
zone_polygon = Polygon(zone_coords)

def is_inside_zone(lat, lon):
    return zone_polygon.contains(Point(lat, lon))

# Dataset
data = {
    'gps_match':[1,0,1,1,0,1,0,1,1,0,1,0],
    'duplicate':[0,0,1,0,1,0,1,0,0,1,0,1],
    'policy_active':[1,1,1,0,1,1,0,1,1,0,1,0],
    'spoof':[0,0,0,1,0,0,1,0,0,1,0,1],
    'claim_count':[1,5,3,10,8,2,7,1,2,9,1,6],
    'avg_gap':[10,1,3,0.5,1,8,2,12,10,0.2,15,1],
    'label':[1,0,0,0,0,1,0,1,1,0,1,0]
}

df = pd.DataFrame(data)
X = df[['gps_match','duplicate','policy_active','spoof','claim_count','avg_gap']]
y = df['label']

model = LogisticRegression()
model.fit(X, y)

def decision(score):
    if score >= 75:
        return "APPROVED"
    elif score >= 40:
        return "REVIEW"
    else:
        return "REJECT"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    lat = data.get("lat", 13.0827)
    lon = data.get("lon", 80.2707)

    gps_match = 1 if is_inside_zone(lat, lon) else 0

    sample = np.array([[
        gps_match,
        data['duplicate'],
        data['policy_active'],
        data['spoof'],
        data['claim_count'],
        data['avg_gap']
    ]])

    prediction = model.predict(sample)
    prob = model.predict_proba(sample)

    confidence = prob[0][1] * 100

    return jsonify({
        "prediction": "Genuine" if prediction[0] == 1 else "Fraud",
        "confidence": round(confidence, 2),
        "decision": decision(confidence)
    })

if __name__ == '__main__':
    app.run(port=5000)