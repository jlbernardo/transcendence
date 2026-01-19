from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from ..serializers.auth import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from drf_spectacular.utils import extend_schema

User = get_user_model()

@extend_schema(
    request=UserRegistrationSerializer,
    responses={201: UserSerializer},
    auth=[]
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registers a new user with email and password.
    Passwords are automatically hashed by Django.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    request=UserLoginSerializer,
    responses={200: UserSerializer},
    auth=[]
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Authenticates user with email and password.
    Returns token for authenticated requests.
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        user.is_online = True
        user.save(update_fields=['is_online'])
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful.'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    request=None,
    responses={200: None}
)
@api_view(['POST'])
def logout(request):
    """
    User logout and token removal.
    """
    try:
        request.user.is_online = False
        request.user.save(update_fields=['is_online'])
        request.user.auth_token.delete()
        return Response(
            {'message': 'Logout successful.'},
            status=status.HTTP_200_OK
        )
    except:
        return Response(
            {'error': 'Logout failed.'},
            status=status.HTTP_400_BAD_REQUEST
        )
