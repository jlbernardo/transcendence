from django.db import models
from django.conf import settings

class Profile(models.Model):
    """
    Profile model that inherits from Django's base model class.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    bio = models.TextField(blank=True)
    # avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return f"Profile({self.user.email})"
