from rest_framework import serializers
from django.contrib.auth import get_user_model
from accounts.models.friendship import FriendRequest
from accounts.serializers.auth import UserSerializer

User = get_user_model()

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    
    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'accepted', 'created_at']
        read_only_fields = ['id', 'from_user', 'to_user', 'created_at']


class SendFriendRequestSerializer(serializers.Serializer):
    to_user_id = serializers.IntegerField()

    def validate_to_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found.')
        return value


class AcceptFriendRequestSerializer(serializers.Serializer):
    request_id = serializers.IntegerField()
