from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator

app = Flask(__name__)

LANGUAGES = {
    "auto": "Auto Detect",
    "en": "English",
    "ta": "Tamil",
    "hi": "Hindi",
    "te": "Telugu",
    "ml": "Malayalam",
    "kn": "Kannada",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh-CN": "Chinese",
    "ar": "Arabic",
    "ru": "Russian",
    "pt": "Portuguese"
}


@app.route("/")
def home():
    return render_template("index.html", languages=LANGUAGES)


@app.route("/translate", methods=["POST"])
def translate_text():
    try:
        data = request.get_json()

        text = data.get("text", "").strip()
        source_language = data.get("source_language", "auto")
        target_language = data.get("target_language", "en")

        if not text:
            return jsonify({
                "success": False,
                "message": "Please enter text to translate."
            }), 400

        if len(text) > 4500:
            return jsonify({
                "success": False,
                "message": "Please enter text under 4500 characters."
            }), 400

        if source_language == target_language and source_language != "auto":
            return jsonify({
                "success": False,
                "message": "Source and target languages cannot be the same."
            }), 400

        translated_text = GoogleTranslator(
            source=source_language,
            target=target_language
        ).translate(text)

        return jsonify({
            "success": True,
            "translated_text": translated_text
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": f"Translation failed: {str(error)}"
        }), 500


if __name__ == "__main__":
    app.run(debug=True)