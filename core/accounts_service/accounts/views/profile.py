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

@api_view(['PUT'])
def update_profile(request):
    """
    Updates authenticated user profile.
    Requires authentication token in header.
    """
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def avatar(request):
    """
    Avatar upload for authenticated user.
    Requires authentication token in header.
    """
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    profile = Profile.objects.get(user=request.user)

    if request.method == 'PUT':
        if 'avatar' not in request.FILES:
            return Response(
                {'error': 'No avatar file provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if profile.avatar:
            profile.avatar.delete(save=False)
        
        serializer = ProfileSerializer(profile, data={'avatar': request.FILES['avatar']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #elif request.method == 'DELETE':