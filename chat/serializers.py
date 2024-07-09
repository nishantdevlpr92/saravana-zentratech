from rest_framework import serializers
from chat.models import Chat
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()
    recipient_username = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'sender', 'sender_username', 'recipient', 'recipient_username', 'message', 'seen', 'created_at']

    def get_sender_username(self, obj):
        return obj.sender.username

    def get_recipient_username(self, obj):
        return obj.recipient.username