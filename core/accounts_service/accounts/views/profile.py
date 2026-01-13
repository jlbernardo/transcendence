from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers.profile import ProfileSerializer
from ..models.profile import Profile


@api_view(['GET'])
def profile(request):
    """
    Returns authenticated user profile.
    Requires authentication token in header.
    """
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)
