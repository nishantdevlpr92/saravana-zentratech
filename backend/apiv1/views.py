from rest_framework.response import Response
from chat.models import Chat
from user.models import User, FriendRequest
from rest_framework import viewsets, status
from chat.serializers import ChatSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from user.serializers import UserSerializer, FriendRequestSerializer
from django.contrib.auth import get_user_model
from .filters import UserFilter
from django_filters.rest_framework import DjangoFilterBackend

User = get_user_model()


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ("id", "sender", "recipient", "message")

    @action(detail=False, methods=['get'])
    def user_chats(self, request):
        """
        Retrieve the chats between two users.

        This function is a custom action for the ChatViewSet class. It allows retrieving the chats between two users
        specified by their IDs. The function expects the sender's ID and the recipient's ID to be provided in the
        query parameters of the GET request.
        """

        sender_id = request.query_params.get('user1', None)
        recipient_id = request.query_params.get('user2', None)

        if sender_id is None or recipient_id is None:
            return Response({'error': 'Both sender_id and recipient_id must be provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        chats = Chat.objects.filter(
            Q(sender__id=sender_id, recipient__id=recipient_id) |
            Q(sender__id=recipient_id, recipient__id=sender_id)
        )

        serializer = self.get_serializer(chats, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter


class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'id': ['exact', 'in'],
        'from_user': ['exact', 'in'],
        'to_user': ['exact', 'in'],
    }

    @action(detail=False, methods=['post'])
    def accept(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'detail': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend_request = FriendRequest.objects.get(
                from_user=user_id, to_user=request.user)
        except FriendRequest.DoesNotExist:
            return Response({'detail': 'Friend request does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        from_user = friend_request.from_user
        to_user = friend_request.to_user

        # Add each other to friends
        from_user.friends.add(to_user)
        to_user.friends.add(from_user)

        # Delete the friend request
        friend_request.delete()

        return Response({'detail': 'Friend request accepted.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def decline(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'detail': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend_request = FriendRequest.objects.get(
                from_user=user_id, to_user=request.user)
        except FriendRequest.DoesNotExist:
            return Response({'detail': 'Friend request does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        friend_request.delete()

        return Response({'detail': 'Friend request declined.'}, status=status.HTTP_200_OK)
