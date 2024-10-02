from flask import Flask, request, jsonify
from transformers import pipeline
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
from encryption import encrypt_entry
import logging
from datetime import datetime, timedelta

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Firebase
cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load pre-trained emotion detection model
emotion_analyzer = pipeline("sentiment-analysis", model="j-hartmann/emotion-english-distilroberta-base")

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Negative emotions list
NEGATIVE_EMOTIONS = ["sadness", "anger", "fear", "disgust"]

@app.route('/api/analyze-emotion', methods=['POST'])
def analyze_emotion():
    try:
        data = request.json
        entry = data['entry']
        user_id = data['userId']
        encrypted_entry = encrypt_entry(entry)

        # Perform emotion analysis
        analysis = emotion_analyzer(entry)
        emotion = analysis[0]['label']

        # Store diary entry and emotion in Firestore
        # db.collection("diary").add({
        #     "userId": user_id,
        #     "entry": encrypted_entry,
        #     "emotion": emotion,
        #     "timestamp": firestore.SERVER_TIMESTAMP
        # })

        # Check for consecutive negative emotions
        consecutive_neg_days, activity, music = check_consecutive_negative_emotions(user_id, emotion)

        # Return the detected emotion and activity/music recommendation
        return jsonify({
            'emotion': emotion,
            'consecutive_neg_days': consecutive_neg_days,
            'activity': activity,
            'music': music
        })
    except Exception as e:
        logging.error("Error processing request: %s", str(e))
        return jsonify({'error': str(e)}), 500  # Return a 500 error with the error message

def check_consecutive_negative_emotions(user_id, latest_emotion):
    # Fetch the diary entries for the last 7 days
    now = datetime.now()
    last_7_days = now - timedelta(days=7)

    # Reference to the user's diary collection
    user_doc_ref = db.collection("users").document(user_id)  # Get user document reference
    diary_collection_ref = user_doc_ref.collection("diaries")  # Get the diaries subcollection reference

    # Fetch diary entries from the last 7 days
    docs = diary_collection_ref.where("date", ">=", last_7_days.isoformat()).get()  # Assuming 'date' is stored in ISO format

    # Count negative emotion entries
    negative_days = 0
    for doc in docs:
        emotion = doc.to_dict().get("emotion")
        if emotion in NEGATIVE_EMOTIONS:
            logging.debug(doc.to_dict())  # Use logging for debugging
            negative_days += 1

    # If more than 3 days of negative emotions, recommend activities and music
    activity, music = "", ""
    if negative_days >= 3 or latest_emotion in NEGATIVE_EMOTIONS:
        activity = "Try meditation, exercise, or talking to a friend."
        music = "We recommend listening to calming, uplifting music."
    else:
        activity = "Keep up the positive energy!"
        music = "Feel free to explore your favorite playlists."

    return negative_days, activity, music

@app.route('/api/suggest-activity', methods=['GET'])
def suggest_activity():
    emotion = request.args.get('emotion')
    if emotion == "sadness":
        activity = "Try meditation or yoga."
    else:
        activity = "Keep up the positive energy!"
    return jsonify({'activity': activity})

if __name__ == '__main__':
    app.run(debug=True)
