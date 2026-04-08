import os
import sys
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk

def test_azure_voice(text, voice_name_to_test):
    # Load env vars
    load_dotenv()
    speech_key = os.environ.get('AZURE_SPEECH_KEY')
    speech_region = os.environ.get('AZURE_SPEECH_REGION')

    if not speech_key or not speech_region:
        print("MISSING KEYS in .env")
        sys.exit(1)

    print(f"Testing Voice: {voice_name_to_test}")
    try:
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
        speech_config.speech_synthesis_voice_name = voice_name_to_test
        speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)
        
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
        result = speech_synthesizer.speak_text_async(text).get()
        
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print(f"SUCCESS. Audio length: {len(result.audio_data)} bytes")
        elif result.reason == speechsdk.ResultReason.Canceled:
            details = result.cancellation_details
            print(f"CANCELED. Reason: {details.reason}")
            print(f"Error details: {details.error_details}")
    except Exception as e:
        print(f"EXCEPTION: {str(e)}")

if __name__ == "__main__":
    print("--- CHINESE ---")
    test_azure_voice("你好", "zh-CN-XiaoxiaoNeural")
    print("--- ENGLISH ---")
    test_azure_voice("Hello world", "en-US-AriaNeural")
    print("--- IGBO ---")
    test_azure_voice("Nnoo", "ig-NG-EzinneNeural")
