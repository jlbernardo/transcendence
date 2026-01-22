from django.test import TestCase
from accounts.models.user import CustomUser
from accounts.models.friendship import FriendRequest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class FriendshipTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.send_request_url = reverse('send_friend_request')
        self.accept_request_url = reverse('accept_friend_request')
        self.list_pending_requests_url = reverse('list_pending_requests')
        self.list_friends_url = reverse('list_friends')
        
        self.user1 = CustomUser.objects.create_user(
            email="user1@example.com",
            username="user1",
            password="SecurePass123!"
        )
        
        self.user2 = CustomUser.objects.create_user(
            email="user2@example.com",
            username="user2",
            password="SecurePass123!"
        )
        
        self.user3 = CustomUser.objects.create_user(
            email="user3@example.com",
            username="user3",
            password="SecurePass123!"
        )
        
        login_data = {
            "email": "user1@example.com",
            "password": "SecurePass123!"
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        self.token_user1 = login_response.data["token"]
        
        login_data2 = {
            "email": "user2@example.com",
            "password": "SecurePass123!"
        }
        login_response2 = self.client.post(self.login_url, login_data2, format='json')
        self.token_user2 = login_response2.data["token"]

    def test_send_friend_request_successfully(self):
        """
        Test that a user can send a friend request to another user
        """
        data = {
            "to_user_id": self.user2.id
        }
        response = self.client.post(
            self.send_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['from_user']['id'], self.user1.id)
        self.assertEqual(response.data['to_user']['id'], self.user2.id)
        self.assertFalse(response.data['accepted'])

    def test_send_friend_request_to_self(self):
        """
        Test that a user cannot send a friend request to themselves
        """
        data = {
            "to_user_id": self.user1.id
        }
        response = self.client.post(
            self.send_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_send_duplicate_friend_request(self):
        """
        Test that a user cannot send duplicate friend requests
        """
        data = {
            "to_user_id": self.user2.id
        }
        self.client.post(
            self.send_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}',
            format='json'
        )
        
        response = self.client.post(
            self.send_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_send_friend_request_to_nonexistent_user(self):
        """
        Test that sending a friend request to a nonexistent user fails
        """
        data = {
            "to_user_id": 9999
        }
        response = self.client.post(
            self.send_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_send_friend_request_without_authentication(self):
        """
        Test that unauthenticated users cannot send friend requests
        """
        data = {
            "to_user_id": self.user2.id
        }
        response = self.client.post(self.send_request_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_accept_friend_request_successfully(self):
        """
        Test that a user can accept a friend request sent to them
        """
        friend_request = FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=False
        )
        
        data = {
            "request_id": friend_request.id
        }
        response = self.client.post(
            self.accept_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}',
            format='json'
        )
        print(f'response to accept friend request: {response}')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['accepted'])
        
        friend_request.refresh_from_db()
        self.assertTrue(friend_request.accepted)

    def test_accept_friend_request_not_recipient(self):
        """
        Test that a user cannot accept a friend request not sent to them
        """
        friend_request = FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=False
        )
        
        data = {
            "request_id": friend_request.id
        }
        response = self.client.post(
            self.accept_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)

    def test_accept_already_accepted_request(self):
        """
        Test that accepting an already accepted request returns error
        """
        friend_request = FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=True
        )
        
        data = {
            "request_id": friend_request.id
        }
        response = self.client.post(
            self.accept_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_accept_nonexistent_friend_request(self):
        """
        Test that accepting a nonexistent friend request fails
        """
        data = {
            "request_id": 9999
        }
        response = self.client.post(
            self.accept_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_friends_empty(self):
        """
        Test that a user with no friends gets an empty list
        """
        response = self.client.get(
            self.list_friends_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_list_friends_with_accepted_requests(self):
        """
        Test that only accepted friend requests appear in friends list
        """
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=True
        )
        
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user3,
            accepted=False
        )
        
        response = self.client.get(
            self.list_friends_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.user2.id)

    def test_list_friends_bidirectional(self):
        """
        Test that friendship works in both directions
        """
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=True
        )
        
        response1 = self.client.get(
            self.list_friends_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}'
        )
        
        response2 = self.client.get(
            self.list_friends_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}'
        )
        
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response1.data), 1)
        self.assertEqual(len(response2.data), 1)
        self.assertEqual(response1.data[0]['id'], self.user2.id)
        self.assertEqual(response2.data[0]['id'], self.user1.id)

    def test_list_friends_without_authentication(self):
        """
        Test that unauthenticated users cannot list friends
        """
        response = self.client.get(self.list_friends_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cannot_send_request_if_already_friends(self):
        """
        Test that users cannot send friend request if they are already friends
        """
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=True
        )
        
        data = {
            "to_user_id": self.user2.id
        }
        response = self.client.post(
            self.send_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_cannot_send_request_if_already_friends_reverse(self):
        """
        Test that users cannot send request if friendship exists in reverse direction
        """
        FriendRequest.objects.create(
            from_user=self.user2,
            to_user=self.user1,
            accepted=True
        )
        
        data = {
            "to_user_id": self.user2.id
        }
        response = self.client.post(
            self.send_request_url, 
            data, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}',
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_friend_request_model_string_representation(self):
        """
        Test the string representation of FriendRequest model
        """
        friend_request = FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=False
        )
        
        expected_str = f"{self.user1.email} -> {self.user2.email} (pending)"
        self.assertEqual(str(friend_request), expected_str)
        
        friend_request.accepted = True
        friend_request.save()
        
        expected_str = f"{self.user1.email} -> {self.user2.email} (accepted)"
        self.assertEqual(str(friend_request), expected_str)

    def test_list_pending_requests_successfully(self):
        """
        Test that a user can list all pending friend requests received
        """
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=False
        )
        
        FriendRequest.objects.create(
            from_user=self.user3,
            to_user=self.user2,
            accepted=False
        )
        
        response = self.client.get(
            self.list_pending_requests_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Check that both requests are from different users
        from_user_ids = [req['from_user']['id'] for req in response.data]
        self.assertIn(self.user1.id, from_user_ids)
        self.assertIn(self.user3.id, from_user_ids)

    def test_list_pending_requests_empty(self):
        """
        Test that a user with no pending requests gets an empty list
        """
        response = self.client.get(
            self.list_pending_requests_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_list_pending_requests_excludes_accepted(self):
        """
        Test that accepted friend requests do not appear in pending list
        """
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=False
        )
        
        FriendRequest.objects.create(
            from_user=self.user3,
            to_user=self.user2,
            accepted=True
        )
        
        response = self.client.get(
            self.list_pending_requests_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['from_user']['id'], self.user1.id)
        self.assertFalse(response.data[0]['accepted'])

    def test_list_pending_requests_only_received(self):
        """
        Test that only received requests appear, not sent requests
        """
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=False
        )
        
        FriendRequest.objects.create(
            from_user=self.user2,
            to_user=self.user3,
            accepted=False
        )
        
        response = self.client.get(
            self.list_pending_requests_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['from_user']['id'], self.user1.id)
        self.assertEqual(response.data[0]['to_user']['id'], self.user2.id)

    def test_list_pending_requests_without_authentication(self):
        """
        Test that unauthenticated users cannot list pending requests
        """
        response = self.client.get(self.list_pending_requests_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_friends_online_status(self):
        """
        Test that user can see friend's online status
        """
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=True
        )
        
        response1 = self.client.get(
            self.list_friends_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}'
        )
        
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response1.data), 1)
        self.assertEqual(response1.data[0]['id'], self.user2.id)
        self.assertTrue(response1.data[0]['is_online'])
        
        response2 = self.client.get(
            self.list_friends_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}'
        )
        
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response2.data), 1)
        self.assertEqual(response2.data[0]['id'], self.user1.id)
        self.assertTrue(response2.data[0]['is_online'])

    def test_friends_offline_status(self):
        """
        Test that user can see friend's offline status
        """
        FriendRequest.objects.create(
            from_user=self.user1,
            to_user=self.user2,
            accepted=True
        )
        
        logout_url = reverse('logout')
        logout_response = self.client.post(
            logout_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user2}'
        )
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        
        response = self.client.get(
            self.list_friends_url, 
            HTTP_AUTHORIZATION=f'Token {self.token_user1}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.user2.id)
        self.assertFalse(response.data[0]['is_online'])
