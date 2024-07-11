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
User = get_user_model()


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

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

    @action(detail=False, methods=['get'])
    def unfriended_users(self, request):
        """
        Retrieve the list of unfriended users.

        This function is a custom action for the UserViewSet class. It allows retrieving the list of unfriended users
        for the currently authenticated user. The function retrieves the list of friends of the authenticated user,
        excludes the authenticated user itself, and then retrieves all the users that are not in the list of friends.
        The function then serializes the list of users using the serializer specified in the UserViewSet class and
        returns the serialized data as a Response object.

        Parameters:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: The serialized data of the list of unfriended users.
        """
        friends = request.user.friends.all()
        users = User.objects.exclude(id__in=friends).exclude(id=request.user.id)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_details(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]