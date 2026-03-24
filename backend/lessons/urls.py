from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ModuleViewSet, LessonViewSet, VocabularyViewSet, QuizViewSet, ProgressViewSet

router = DefaultRouter()
router.register(r'modules', ModuleViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'vocabularies', VocabularyViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'progress', ProgressViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
]
