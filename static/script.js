const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");
const swapButton = document.getElementById("swapButton");

const copyButton = document.getElementById("copyButton");
const speakButton = document.getElementById("speakButton");

const characterCount = document.getElementById("characterCount");
const message = document.getElementById("message");


inputText.addEventListener("input", () => {
    characterCount.textContent = `${inputText.value.length} / 4500`;
});


translateButton.addEventListener("click", async () => {
    const text = inputText.value.trim();

    if (!text) {
        showMessage("Please enter text to translate.", "red");
        return;
    }

    translateButton.disabled = true;
    translateButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Translating...';

    outputText.value = "";
    showMessage("", "");

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                source_language: sourceLanguage.value,
                target_language: targetLanguage.value
            })
        });

        const data = await response.json();

        if (data.success) {
            outputText.value = data.translated_text;
            showMessage("Translation completed successfully! ✅", "");
        } else {
            showMessage(data.message || "Translation failed.", "red");
        }

    } catch (error) {
        showMessage("Server error. Please try again.", "red");
    }

    translateButton.disabled = false;
    translateButton.innerHTML = '<i class="fa-solid fa-language"></i> Translate';
});


swapButton.addEventListener("click", () => {
    if (sourceLanguage.value === "auto") {
        showMessage("Choose a source language before swapping.", "red");
        return;
    }

    const oldSource = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = oldSource;

    const oldInput = inputText.value;
    inputText.value = outputText.value;
    outputText.value = oldInput;

    characterCount.textContent = `${inputText.value.length} / 4500`;
});


copyButton.addEventListener("click", async () => {
    const translatedText = outputText.value.trim();

    if (!translatedText) {
        showMessage("Nothing to copy yet.", "red");
        return;
    }

    try {
        await navigator.clipboard.writeText(translatedText);
        showMessage("Translated text copied! 📋", "green");
    } catch (error) {
        showMessage("Could not copy text.", "red");
    }
});


speakButton.addEventListener("click", () => {
    const translatedText = outputText.value.trim();

    if (!translatedText) {
        showMessage("Translate text first.", "red");
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(translatedText);

    const languageCode = targetLanguage.value;

    const speechLanguages = {
        "en": "en-US",
        "ta": "ta-IN",
        "hi": "hi-IN",
        "te": "te-IN",
        "ml": "ml-IN",
        "kn": "kn-IN",
        "fr": "fr-FR",
        "de": "de-DE",
        "es": "es-ES",
        "it": "it-IT",
        "ja": "ja-JP",
        "ko": "ko-KR",
        "zh-CN": "zh-CN",
        "ar": "ar-SA",
        "ru": "ru-RU",
        "pt": "pt-PT"
    };

    speech.lang = speechLanguages[languageCode] || "en-US";

    window.speechSynthesis.speak(speech);
});


function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}