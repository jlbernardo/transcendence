from rest_framework import serializers
from accounts.models.profile import Profile
from accounts.serializers.auth import UserSerializer

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio', 'avatar']
        read_only_fields = ['id', 'user']

    # def validate_bio(self, value):
    #     if len(value) < 5:
    #         raise serializers.ValidationError(
    #             'Bio must be 5 characters or more.'
    #         )
    #     return value
    
    def validate_avatar(self, avatar):
        max_size = 2 * 1024 * 1024
        if avatar.size > max_size:
            raise serializers.ValidationError("Avatar too large")

        return avatar