from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from ..models.friendship import FriendRequest
from ..serializers.friendship import (
    SendFriendRequestSerializer,
    AcceptFriendRequestSerializer,
    FriendRequestSerializer
)
from ..serializers.auth import UserSerializer

User = get_user_model()

@api_view(['POST'])
def send_friend_request(request):
    serializer = SendFriendRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    from_user = request.user
    to_user_id = serializer.validated_data['to_user_id']

    if from_user.id == to_user_id:
        return Response(
            {'error': 'Cannot send friend request to yourself.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    to_user = get_object_or_404(User, id=to_user_id)

    sent_exists = from_user.sent_friend_requests.filter(to_user=to_user).exists()
    received_exists = from_user.received_friend_requests.filter(from_user=to_user).exists()

    if sent_exists or received_exists:
        return Response(
            {'error': 'A friend request or friendship already exists.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    friend_request = FriendRequest.objects.create(
        from_user=from_user,
        to_user=to_user
    )

    return Response(
        FriendRequestSerializer(friend_request).data,
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
def accept_friend_request(request):
    serializer = AcceptFriendRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    friend_request = get_object_or_404(
        FriendRequest,
        id=serializer.validated_data['request_id']
    )

    if friend_request.to_user != request.user:
        return Response(
            {'error': 'You cannot accept this request.'},
            status=status.HTTP_403_FORBIDDEN
        )

    if friend_request.accepted:
        return Response(
            {'error': 'Friend request already accepted.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    friend_request.accepted = True
    friend_request.save()

    return Response(
        FriendRequestSerializer(friend_request).data,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def list_pending_requests(request):
    """
    Returns all pending friend requests received by the authenticated user.
    """
    pending_requests = FriendRequest.objects.filter(
        to_user=request.user,
        accepted=False
    )

    return Response(
        FriendRequestSerializer(pending_requests, many=True).data,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def list_friends(request):
    user = request.user

    sent_accepted = user.sent_friend_requests.filter(accepted=True)
    received_accepted = user.received_friend_requests.filter(accepted=True)

    friends = []
    friends.extend([fr.to_user for fr in sent_accepted])
    friends.extend([fr.from_user for fr in received_accepted])

    return Response(
        UserSerializer(friends, many=True).data,
        status=status.HTTP_200_OK
    )
