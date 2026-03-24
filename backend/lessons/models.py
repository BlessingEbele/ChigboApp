from django.db import models
from django.conf import settings

class Module(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    level_required = models.IntegerField(default=0, help_text="0 for Beginner, etc.")
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Level {self.level_required}: {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Markdown or HTML content for the lesson")
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.module.title} - {self.title}"

class Vocabulary(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='vocabularies')
    word_igbo = models.CharField(max_length=100)
    word_chinese = models.CharField(max_length=100)
    word_english = models.CharField(max_length=100, blank=True)
    pronunciation_audio_url = models.URLField(blank=True, help_text="Link to TTS audio representing the word")
    
    def __str__(self):
        return f"{self.word_igbo} / {self.word_chinese}"

class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    question_text = models.CharField(max_length=500)
    correct_answer = models.CharField(max_length=200)
    options = models.JSONField(help_text="Provide a list of 4 options e.g., ['A', 'B', 'C', 'D']")
    
    def __str__(self):
        return f"Quiz for {self.lesson.title}"

class Progress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0, help_text="Quiz score or AI pronunciation score")
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"
