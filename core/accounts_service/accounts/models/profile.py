from django.db import models
from django.conf import settings
import os
import hashlib
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill

def avatar_upload_path(instance, filename):
    """
    Create upload path for avatar: avatars/{user id}_{hash_string}.{extension}
    """
    ext = os.path.splitext(filename)[1]
    content = instance.avatar.file.read() 
    instance.avatar.file.seek(0)
    hash_string = hashlib.md5(content).hexdigest()
    return f'avatars/user_{instance.user.id}_{hash_string}{ext}'

class Profile(models.Model):
    """
    Profile model that inherits from Django's base model class.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    bio = models.TextField(blank=True)
    avatar = ProcessedImageField(
        upload_to=avatar_upload_path,
        processors=[ResizeToFill(256, 256)],
        format='PNG',
        blank=True,
        null=True
    )

    def __str__(self):
        return f"Profile({self.user.email})"
