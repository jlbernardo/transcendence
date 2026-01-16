from django.test import TestCase
from accounts.models.user import CustomUser
from django.db import IntegrityError
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.core.cache import cache

class RateLimitTestCase(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.profile_url = reverse('profile')
        self.login_url = reverse('login')
        self.register_url = reverse('register')
        
        self.user = CustomUser.objects.create_user(
            email="user@example.com",
            username="user",
            password="SecurePass123!"
        )
    
    def tearDown(self):
        cache.clear()

    def test_anon_rate_limit(self):
        """
        Test rate limit for non-authenticated users (100/day)
        """
        for i in range(1, 102):
            data = {
                "email": f"user{i}@example.com",
                "username": f"user{i}",
                "password": "SecurePass123!",
                "password2": "SecurePass123!"
            }
            response = self.client.post(self.register_url, data, format='json')

        self.assertEqual(i, 101)
        self.assertEqual(response.status_code, 429)

    def test_user_rate_limit(self):
        """
        Test rate limit for authenticated users (1000/day)
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }
        login_response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(login_response.status_code, 200)
        token = login_response.data["token"]

        for i in range(1, 1002):
            profile_response = self.client.get(self.profile_url, HTTP_AUTHORIZATION=f'Token {token}')

        self.assertEqual(i, 1001)
        self.assertEqual(profile_response.status_code, 429)


        