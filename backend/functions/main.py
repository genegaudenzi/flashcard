import json
import firebase_admin
import openai
import logging
from flask import jsonify, request, make_response
from openai import OpenAIError
from firebase_functions import https_fn
import os

# ✅ Set up logging
logging.basicConfig(level=logging.INFO)

# ✅ Initialize Firebase Admin
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# ✅ Function to handle CORS correctly
@https_fn.on_request(secrets=["OPENAI_KEY"])
def generate_flashcard(request):
    """ Generates a multiple-choice flashcard question using OpenAI GPT-4o-mini model. """
    print("🚀 Generating flashcard...")

    # ✅ Define CORS Headers
    cors_headers = {
        "Access-Control-Allow-Origin": "*",  # ✅ Allow all origins (for dev) or set to "http://localhost:3001"
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "3600",  # ✅ Cache preflight response
    }

    # ✅ Handle CORS Preflight (OPTIONS request)
    if request.method == "OPTIONS":
        print("🛑 Handling CORS preflight request")
        response = make_response("", 204)  # ✅ Empty response for preflight
        response.headers.extend(cors_headers)
        return response

    # ✅ Retrieve OpenAI API Key
    OPENAI_API_KEY = os.environ.get("OPENAI_KEY")

    if not OPENAI_API_KEY:
        response = jsonify({"error": "❌ OpenAI API key not found."})
        response.headers.extend(cors_headers)
        return response, 500

    client = openai.OpenAI(api_key=OPENAI_API_KEY)

    try:
        data = request.get_json()
        topic = data.get("topic", "General Knowledge")

        prompt = f"""
        Generate a unique and challenging multiple-choice flashcard question related to {topic}. 
        Ensure the question is different from commonly asked questions on this topic.
        Include:
        {{
            "question": "A unique question text?",
            "choices": {{
                "A": "Choice A",
                "B": "Choice B",
                "C": "Choice C",
                "D": "Choice D"
            }},
            "correct_answer": "B"
        }}

        - Ensure the question is unique and not a repeat of common questions.
        - The correct answer choice should randomly change. 
        - Return ONLY a JSON object without any extra text.
        """


        print(f"📝 Prompt: {prompt}")

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,  # Controls randomness (lower = more deterministic)
            top_p=0.8         # Nucleus sampling (lower = focus on high-probability words)
        )

        ai_response = response.choices[0].message.content.strip()
        print(f"🤖 OpenAI Response: {ai_response}")

        json_response = jsonify(json.loads(ai_response))
        json_response.headers.extend(cors_headers)  # ✅ Ensure CORS headers are included
        return json_response

    except OpenAIError as oe:
        print(f"❌ OpenAI API Error: {str(oe)}")
        response = jsonify({"error": "OpenAI API error."})
        response.headers.extend(cors_headers)
        return response, 500

    except Exception as e:
        print(f"❌ Unexpected server error: {str(e)}")
        response = jsonify({"error": "Internal Server Error"})
        response.headers.extend(cors_headers)
        return response, 500
