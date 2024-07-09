from rest_framework import serializers
from chat.models import Chat
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_active']

class ChatSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer()
    recipient = UserBasicSerializer()

    class Meta:
        model = Chat
        # depth = 1
        fields = ['id', 'sender', 'recipient', 'message', 'seen', 'created_at']
