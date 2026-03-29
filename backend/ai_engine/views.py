from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
import subprocess
import tempfile
import os
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
            # Microsoft Edge's free TTS does not expose the raw 'ig-NG' Igbo voice tag
            # Nigerian English sounded "totally wrong" because of English phonics.
            # We are falling back to Swahili (sw-KE-ZuriNeural), which shares very similar 
            # Niger-Congo/Bantu phonetic and vowel structures, resulting in a much closer pronunciation.
            voice = 'sw-KE-ZuriNeural' 
            
            if language == 'zh-CN':
                voice = 'zh-CN-XiaoxiaoNeural'
            elif language == 'en':
                voice = 'en-US-AriaNeural'
                
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp:
                tmp_path = tmp.name
                
            # Run edge-tts synchronous CLI 
            process = subprocess.run(
                ['edge-tts', '--voice', voice, '--text', text, '--write-media', tmp_path],
                capture_output=True, check=True
            )
            
            with open(tmp_path, 'rb') as f:
                audio_data = f.read()
                
            os.remove(tmp_path)
            
            response = HttpResponse(audio_data, content_type='audio/mpeg')
            response['Content-Disposition'] = f'attachment; filename="pronunciation.mp3"'
            return response
            
        except subprocess.CalledProcessError as e:
            return Response({"error": f"TTS Engine failed: {e.stderr.decode()}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
