from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from ..serializers.profile import ProfileSerializer
from ..models.profile import Profile

def get_user_profile(user):
    return Profile.objects.get(user=user)

@extend_schema(
    request=ProfileSerializer,
    responses={200: ProfileSerializer}
)
@api_view(['GET', 'PUT'])
def profile(request):
    """
    Returns/Updates authenticated user profile.
    Requires authentication token in header.
    """
    profile = get_user_profile(request.user)
    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    request={'multipart/form-data': {'type': 'object', 'properties': {'avatar': {'type': 'string', 'format': 'binary'}}}},
    responses={200: ProfileSerializer}
)
@api_view(['PUT', 'DELETE'])
def avatar(request):
    """
    Uploads/Deletes avatar for authenticated user.
    Requires authentication token in header.
    """
    profile = get_user_profile(request.user)

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
    
    elif request.method == 'DELETE':
        if profile.avatar and profile.avatar.name != 'avatars/default.png':
            profile.avatar.delete(save=False)
        
        profile.avatar = 'avatars/default.png'
        profile.save()

        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
