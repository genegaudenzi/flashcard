import json
import firebase_admin
import openai
import logging
from flask import jsonify
from openai import OpenAIError
from firebase_functions.params import SecretParam
from firebase_functions import https_fn
import os

# ✅ Set up logging
logging.basicConfig(level=logging.INFO)

# ✅ Initialize Firebase Admin
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# ✅ Example Function
@https_fn.on_request()
def on_request_example(request):
    return jsonify({"message": "Hello from Firebase Functions!"})

# ✅ Generate Flashcard Function
@https_fn.on_request(secrets=["OPENAI_KEY"])
def generate_flashcard(request):
    """ Generates a multiple-choice flashcard question using OpenAI GPT-4o-mini model. """
    print("🚀 Generating flashcard...")

     # ✅ Retrieve OpenAI API Key securely from environment variables
    OPENAI_API_KEY = os.environ.get("OPENAI_KEY")

     # ✅ Debugging: Check if the key is injected
    print(f"✅ OpenAI API Key Retrieved: {'Yes' if OPENAI_API_KEY else 'No'}")
    print(f"✅ OpenAI API Key Length: {len(OPENAI_API_KEY) if OPENAI_API_KEY else 0}")

    if not OPENAI_API_KEY:
        return jsonify({"error": "❌ OpenAI API key not found. Make sure it's set as a secret."}), 500

    # ✅ Initialize OpenAI Client
    client = openai.OpenAI(api_key=OPENAI_API_KEY)

    try:
        # ✅ Ensure 'topic' exists, default to "General Knowledge"
        data = request.get_json()
        topic = data.get("topic", "General Knowledge")

        prompt = f"""
        Generate a JSON object containing a multiple-choice flashcard question about {topic}. 
        The JSON must be structured as follows:
        {{
            "question": "Your question text?",
            "choices": {{
                "A": "Choice A",
                "B": "Choice B",
                "C": "Choice C",
                "D": "Choice D"
            }},
            "correct_answer": "B"
        }}

        Ensure the response is **ONLY** a valid JSON object without extra text.
        """
        print(f"📝 Prompt: {prompt}")


        # ✅ Fix: Remove store=True, ensure correct API call
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        ai_response = response.choices[0].message.content.strip()
        logging.info(f"🤖 OpenAI Response: {ai_response}")

        # ✅ Ensure response is valid JSON
        try:
            flashcard_data = json.loads(ai_response)
        except json.JSONDecodeError:
            logging.error("❌ Failed to parse OpenAI response as JSON.")
            return jsonify({"error": "Invalid response format from OpenAI. Please try again later."}), 500

        # ✅ Validate response structure
        if "question" not in flashcard_data or "choices" not in flashcard_data or "correct_answer" not in flashcard_data:
            logging.error("❌ OpenAI response is missing required fields.")
            return jsonify({"error": "OpenAI response format is incorrect. Please try again later."}), 500

        return jsonify(flashcard_data)

    except OpenAIError as oe:
        logging.error(f"❌ OpenAI API Error: {str(oe)}")
        return jsonify({"error": "OpenAI API error. Please try again later."}), 500
    
    except Exception as e:
        logging.error(f"❌ Unexpected server error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    
# ✅ Run Flask App (Ensure it uses Port 8080 for Cloud Run)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)