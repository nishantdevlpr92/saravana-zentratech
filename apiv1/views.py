from requests import Response
from chat.models import Chat
from rest_framework import viewsets, status
from chat.serializers import ChatSerializer
from rest_framework.decorators import action
from django.db.models import Q


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    @action(detail=False, methods=['get'])
    def user_chats(self, request):
        sender_id = request.query_params.get('user1', None)
        recipient_id = request.query_params.get('user2', None)

        if sender_id is None or recipient_id is None:
            return Response({'error': 'Both sender_id and recipient_id must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        chats = Chat.objects.filter(
            Q(sender_id=sender_id, recipient_id=recipient_id) |
            Q(sender_id=recipient_id, recipient_id=sender_id)
        )

        serializer = self.get_serializer(chats, many=True)
        return Response(serializer.data)