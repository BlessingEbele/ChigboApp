import os
import json
from google import genai

class AIService:
    """
    Handles interactions with LLMs (Google Gemini API / OpenAI).
    """
    def __init__(self):
        # We will load actual API keys from environment variables later
        self.api_key = os.getenv('GEMINI_API_KEY', 'dummy_key')
        if self.api_key and self.api_key != 'dummy_key':
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def get_chat_response(self, message, level=0, language="Igbo", native_language="en"):
        """
        Sends the user message to the AI Tutor and retrieves the response.
        """
        if not self.client:
            return {"error": "API Key not configured properly."}
            
        # Dynamically inject the user's native language to translate explanations
        native_lang_map = {'zh-hans': 'Mandarin Chinese', 'en': 'English', 'ig': 'Igbo'}
        teaching_lang = native_lang_map.get(native_language, 'English')
            
        prompt = f"Act as a professional {language} language teacher teaching a beginner (Level {level}). Your student speaks {teaching_lang}. You MUST explain all rules, grammar, and pronunciation in {teaching_lang}. Correct mistakes gently.\n\nUser: {message}"
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            return {"response": response.text}
        except Exception as e:
            return {"error": str(e)}

class SpeechService:
    """
    Handles Voice-to-Text and Text-to-Voice conversions.
    """
    def speech_to_text(self, audio_file):
        # Placeholder for Google Cloud Speech-to-Text
        pass

    def text_to_speech(self, text, language="ig"):
        # Placeholder for Google Text-to-Speech
        pass

class TranslationService:
    """
    Handles precise localized translations using DeepL or Google Translate.
    """
    def translate(self, text, source="en", target="ig"):
        # Placeholder for Google Translate API
        pass

class HybridInstructionManager:
    """
    Coordinator class stringing the services together to evaluate and teach.
    """
    def __init__(self):
        self.ai_service = AIService()
        self.speech_service = SpeechService()
        self.translation_service = TranslationService()
        
    def process_spoken_message(self, audio_file, user_level, target_language):
        """
        Full workflow: Speech -> Text -> Grammar check -> Translation -> Voice Synthesis
        """
        # 1. Convert speech to text
        transcribed_text = self.speech_service.speech_to_text(audio_file)
        
        # 2. Get AI correction & response
        ai_response = self.ai_service.get_chat_response(transcribed_text, user_level, target_language)
        
        # 3. Handle translations or TTS as necessary
        # ... logic continues here
        
        return {
            "transcribed": transcribed_text,
            "ai_response": ai_response
        }
