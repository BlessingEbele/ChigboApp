from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
import subprocess
import tempfile
import os
import azure.cognitiveservices.speech as speechsdk
from rest_framework import status, permissions
from .serializers import ChatRequestSerializer
from .services import AIService

class AIChatView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = ChatRequestSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.validated_data.get('message')
            
            # Use user's current level and languages if not provided
            level = serializer.validated_data.get('level', request.user.current_level)
            language = serializer.validated_data.get('language', request.user.target_language)
            native_language = serializer.validated_data.get('native_language', request.user.native_language)
            
            ai_service = AIService()
            result = ai_service.get_chat_response(message, level, language, native_language)
            
            if "error" in result:
                return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            return Response(result, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SpeechSynthesisView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        text = request.data.get('text', '').strip()
        language = request.data.get('language', 'ig')

        if not text:
            return Response({"error": "No text provided to synthesize."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            speech_key = os.environ.get('AZURE_SPEECH_KEY')
            speech_region = os.environ.get('AZURE_SPEECH_REGION')
            
            if not speech_key or not speech_region or speech_key == "your_key_here":
                return Response({"error": "Azure Speech credentials not configured."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)

            voice = 'ig-NG-EzinneNeural' 
            
            if language == 'zh-CN':
                voice = 'zh-CN-XiaoxiaoNeural'
            elif language == 'en':
                voice = 'en-US-AriaNeural'
                
            speech_config.speech_synthesis_voice_name = voice
            speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)
            
            # Use None to avoid playing audio on the server directly
            speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
            
            result = speech_synthesizer.speak_text_async(text).get()
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                response = HttpResponse(result.audio_data, content_type='audio/mpeg')
                response['Content-Disposition'] = 'attachment; filename="pronunciation.mp3"'
                return response
            elif result.reason == speechsdk.ResultReason.Canceled:
                cancellation_details = result.cancellation_details
                return Response({"error": f"Speech synthesis canceled: {cancellation_details.reason}. Details: {cancellation_details.error_details}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({"error": "Unknown synthesis error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
