from firebase_admin import firestore

db = firestore.client()

def check_emotional_trend(user_id):
    entries_ref = db.collection("diary").where("userId", "==", user_id)
    entries = entries_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(5).stream()

    sad_days = 0
    for entry in entries:
        if entry.to_dict()['emotion'] == 'sadness':
            sad_days += 1

    if sad_days >= 3:
        return True
    return False

def auto_connect_psychiatrist(user_id):
    if check_emotional_trend(user_id):
        print(f"Connecting {user_id} to a psychiatrist...")
        # API call to integrate psychiatrist connection logic here
