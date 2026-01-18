from django.test import TestCase
from accounts.models.user import CustomUser
from django.db import IntegrityError
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.profile_url = reverse('user_profile')
        
        self.user = CustomUser.objects.create_user(
            email="user@example.com",
            username="user",
            password="SecurePass123!"
        )

    def test_user_registration(self):
        """
        Test that a new user can register successfully
        """
        data = {
            "email": "user2@example.com",
            "username": "user2",
            "password": "SecurePass123!",
            "password2": "SecurePass123!"
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], "user2@example.com")

    def test_valid_password_login(self):
        """
        Test that registered user can login successfully
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], "user@example.com")

    def test_invalid_password_login(self):
        """
        Test that user not registered cannot login
        """
        data = {
            "email": "user@example.com",
            "password": "WrongPass123!"
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('token', response.data)

    def test_token_is_valid(self):
        """
        Test that with a valid token it is possible to see the profile.
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }
        login_response = self.client.post(self.login_url, data, format='json')
        token = login_response.data["token"]

        profile_response = self.client.get(self.profile_url, HTTP_AUTHORIZATION=f'Token {token}')

        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertIn('id', profile_response.data)
        self.assertIn('email', profile_response.data)
        self.assertIn('username', profile_response.data)
        self.assertEqual(profile_response.data['email'], "user@example.com")

    def test_token_is_invalid(self):
        """
        Test that with a invalid token it is not possible to see the profile.
        """
        token = "invalidtoken"

        profile_response = self.client.get(self.profile_url, HTTP_AUTHORIZATION=f'Token {token}')

        self.assertEqual(profile_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('id', profile_response.data)
        self.assertNotIn('email', profile_response.data)
        self.assertNotIn('username', profile_response.data)

    def test_user_logout(self):
        """
        Test that a logged-in user can logout successfully and invalidate the token
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }
        login_response = self.client.post(self.login_url, data, format='json')
        token = login_response.data["token"]

        logout_response = self.client.post(self.logout_url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        profile_response = self.client.get(self.profile_url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(profile_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('id', profile_response.data)
        self.assertNotIn('email', profile_response.data)
        self.assertNotIn('username', profile_response.data)

    def test_logout_without_token(self):
        """
        Test logout with invalid token
        """
        token = "invalidtoken"

        logout_response = self.client.post(self.logout_url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(logout_response.status_code, status.HTTP_401_UNAUTHORIZED)
