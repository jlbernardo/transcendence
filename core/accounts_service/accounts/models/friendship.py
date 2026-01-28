from django.db import models
from accounts.models.profile import Profile

class FriendRequest(models.Model):
    """
    Friend request model.
    """
    from_user = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='sent_friend_requests'
    )
    to_user = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='received_friend_requests'
    )
    
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')
        ordering = ['-created_at']

    def __str__(self):
        status = "accepted" if self.accepted else "pending"
        return f"{self.from_user.email} -> {self.to_user.email} ({status})"
