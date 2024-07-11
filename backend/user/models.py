from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    friends = models.ManyToManyField('User', symmetrical=False, blank=True)

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fr_from_user')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fr_to_user')
    created_at = models.DateTimeField(auto_now_add=True)
