from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    LANGUAGE_CHOICES = (
        ('en', 'English'),
        ('ig', 'Igbo'),
        ('zh-hans', 'Chinese (Simplified)'),
    )
    
    native_language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    target_language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='ig')
    current_level = models.IntegerField(default=0, help_text="User's proficiency level (0-8)")
    
    def __str__(self):
        return self.username
