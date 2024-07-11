from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from django.db import close_old_connections
from urllib.parse import parse_qs
from jwt import decode as jwt_decode
from django.conf import settings


User = get_user_model()


class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        """
        Asynchronously calls the middleware function to handle the scope, receive, and send parameters.
        Closes old database connections, retrieves a token from the query string in the scope,
        decodes the token using JWT, and sets the user in the scope based on the decoded data.
        If there is an InvalidToken or TokenError, sets the user to AnonymousUser and includes the error in the scope.
        If there is any other exception, raises the exception. If no token is found, sets the user to AnonymousUser.
        Returns the result of calling the super method with the updated scope, receive, and send parameters.
        """

        close_old_connections()
        token = parse_qs(scope["query_string"].decode("utf8")).get("token", None)

        if token:
            token = token[0]
            try:
                UntypedToken(token)
                decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                scope["user"] = await self.get_user(decoded_data["user_id"])
            except (InvalidToken, TokenError) as e:
                scope["user"] = AnonymousUser()
                scope["errors"] = [str(e)]
            except Exception as e:
                raise e
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)


    @staticmethod
    @database_sync_to_async
    def get_user(uid):
        """
        Retrieve a user from the database based on the provided user ID.

        Args:
            uid (int): The ID of the user to retrieve.

        Returns:
            User
        """
        try:
            return User.objects.get(id=uid)
        except User.DoesNotExist:
            return AnonymousUser()


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))