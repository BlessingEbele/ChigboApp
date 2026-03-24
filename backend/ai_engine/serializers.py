from rest_framework import serializers

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True)
    level = serializers.IntegerField(default=0)
    language = serializers.CharField(default="Igbo")
