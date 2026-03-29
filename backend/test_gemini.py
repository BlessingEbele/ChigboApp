import os
import django

# Setup django environment to allow importing services
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chigbo_project.settings')
django.setup()

from ai_engine.services import AIService

def test_gemini():
    print("Testing Gemini integration...")
    service = AIService()
    
    if service.api_key == "dummy_key_replace_with_real_one":
        print("ERROR: Please set a valid GEMINI_API_KEY in backend/.env before testing.")
        return
        
    print(f"API Key configured. Testing with standard prompt...")
    
    # Test getting a response for level 0 learner
    result = service.get_chat_response("Nnọọ (Hello)", level=0, language="Igbo")
    
    print("--------- Response ---------")
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print(result)
    print("----------------------------")

if __name__ == "__main__":
    test_gemini()
