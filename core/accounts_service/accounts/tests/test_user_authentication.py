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

    def test_valid_user_login(self):
        """
        Test that registerd user can login successfully
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

    def test_invalid_user_login(self):
        """
        Test that user not registerd cannot login
        """
        data = {
            "email": "user@example.com",
            "password": "WrongPass123!"
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('token', response.data)
