from django.urls import path
from chat import consumers

websocket_urlpatterns = [
    path('wc/chat/<int:uid>/', consumers.PersonalChatConsumer.as_asgi()),
]
