from django.contrib import admin
from user.models import User, FriendRequest


admin.site.register(User)
admin.site.register(FriendRequest)
