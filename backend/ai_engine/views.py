from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import ChatRequestSerializer
from .services import AIService

class AIChatView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = ChatRequestSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.validated_data.get('message')
            
            # Use user's current level and target language if not provided
            level = serializer.validated_data.get('level', request.user.current_level)
            language = serializer.validated_data.get('language', request.user.target_language)
            
            ai_service = AIService()
            result = ai_service.get_chat_response(message, level, language)
            
            if "error" in result:
                return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            return Response(result, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
