from django.urls import path
from .views import AIChatView, SpeechSynthesisView

urlpatterns = [
    path('chat/', AIChatView.as_view(), name='ai-chat'),
    path('tts/', SpeechSynthesisView.as_view(), name='ai-tts'),
]
