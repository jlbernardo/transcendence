from django.test import TestCase
from accounts.models.user import CustomUser
from django.db import IntegrityError
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class UserTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        
        self.user = CustomUser.objects.create_user(
            email="user@example.com",
            username="user",
            password="SecurePass123!"
        )
        
    def test_user_saving_correctly_in_db(self):
        """
        Test that user is being saved correctly in database
        """
        user = CustomUser.objects.get(email="user@example.com")
        
        self.assertEqual(user.email, "user@example.com")
        self.assertEqual(user.username, "user")
        self.assertTrue(user.check_password("SecurePass123!"))

    def test_email_uniqueness(self):
        """
        Test that a new user cannot be created with an existent email
        """
        with self.assertRaises(IntegrityError):
            CustomUser.objects.create_user(
                email="user@example.com", 
                username="user_duplicate", 
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

    def test_user_is_online_after_login(self):
        """
        Test that user is_online status is set to True after login
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['user']['is_online'])
        
        # Verify in database
        user = CustomUser.objects.get(email="user@example.com")
        self.assertTrue(user.is_online)

    def test_user_is_offline_after_logout(self):
        """
        Test that user is_online status is set to False after logout
        """
        # Login first
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }
        login_response = self.client.post(self.login_url, data, format='json')
        token = login_response.data["token"]
        
        # Verify user is online after login
        user = CustomUser.objects.get(email="user@example.com")
        self.assertTrue(user.is_online)
        
        # Logout
        logout_response = self.client.post(self.logout_url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        
        # Verify user is offline after logout
        user.refresh_from_db()
        self.assertFalse(user.is_online)

    def test_user_is_offline_by_default(self):
        """
        Test that newly created user has is_online=False by default
        """
        new_user = CustomUser.objects.create_user(
            email="newuser@example.com",
            username="newuser",
            password="SecurePass123!"
        )
        
        self.assertFalse(new_user.is_online)

    def test_logout_without_token(self):
        """
        Test logout with invalid token
        """
        token = "invalidtoken"

        logout_response = self.client.post(self.logout_url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(logout_response.status_code, status.HTTP_401_UNAUTHORIZED)
