from rest_framework import serializers
from accounts.models.friendship import FriendRequest
from accounts.serializers.profile import ProfileSerializer
from accounts.models.profile import Profile

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = ProfileSerializer(read_only=True)
    to_user = ProfileSerializer(read_only=True)
    
    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'accepted', 'created_at']
        read_only_fields = ['id', 'from_user', 'to_user', 'created_at']


class SendFriendRequestSerializer(serializers.Serializer):
    to_user_id = serializers.IntegerField()

    def validate_to_user_id(self, value):
        try:
            Profile.objects.get(id=value)
        except Profile.DoesNotExist:
            raise serializers.ValidationError('User not found.')
        return value


class AcceptFriendRequestSerializer(serializers.Serializer):
    request_id = serializers.IntegerField()
