from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from chat.middleware import JwtAuthMiddleware
from channels.db import database_sync_to_async
from chat.serializers import ChatSerializer
from chat.models import Chat
from django.db.models import Q


class PersonalChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        """
        Async function to handle the connection process for the personal chat consumer.
        Sets up the user, recipient, and group name for the chat. 
        Handles errors related to unauthorized access and missing users.
        Prints the group name and channel information.
        """

        await self.accept()
        self.sender = self.scope.get("user", AnonymousUser())
        self.recipient = await JwtAuthMiddleware.get_user(self.scope["url_route"]["kwargs"]["uid"])

        if self.scope.get("errors", None):
            await self.send_json({"errors": self.scope["errors"]}, close=True)
            return

        elif self.sender == AnonymousUser():
            await self.send_json({"errors": ["Unauthorized Access Denied"]}, close=True)
            return

        elif self.recipient == AnonymousUser():
            await self.send_json({"errors": ["User Not Found"]}, close=True)
            return

        # TODO: elif User and recipient are not connected

        self.grp_name = self.set_group_name()
        print(self.grp_name)

        await self.channel_layer.group_add(
            self.grp_name,
            self.channel_name
        )

        chat_history = await self.get_chat_history()
        await self.send_json(chat_history)

    def set_group_name(self):
        if self.recipient.id > self.sender.id:
            return f"{self.sender.id}-{self.recipient.id}"
        else:
            return f"{self.recipient.id}-{self.sender.id}"

    @database_sync_to_async
    def get_chat_history(self):
        """
        Retrieve the chat history between the sender and recipient.

        Returns:
            QuerySet: A queryset of Chat instances.
        """
        return ChatSerializer(
            Chat.objects.filter(
                Q(sender=self.sender, recipient=self.recipient) | 
                Q(sender=self.recipient, recipient=self.sender)
            ),
            many=True
        ).data

    async def receive_json(self, content, **kwargs):
        await database_sync_to_async(Chat.objects.create)(sender=self.sender, recipient=self.recipient, message=content["message"])
        await self.channel_layer.group_send(
            self.grp_name,
            {
                "type": "chat.message",
                "message": content["message"],
            }
        )
        self.sender, self.recipient

    async def chat_message(self, event):
        await self.send_json({"message": event["message"]})