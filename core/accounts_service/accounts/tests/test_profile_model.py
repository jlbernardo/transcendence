from django.db import IntegrityError
from django.test import TestCase
from accounts.models.user import CustomUser
from accounts.models.profile import Profile
from django.urls import reverse
from rest_framework.test import APIClient

class ProfileTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.profile_url = reverse('profile')

        self.user = CustomUser.objects.create_user(
        email="user@example.com", 
        username="user", 
        password="SecurePass123!"
        )

    def test_profile_creation_with_user_creation(self):
        """
        Test that a profile exists when a user is created
        """
        profile_exists = Profile.objects.filter(user=self.user).exists()

        self.assertTrue(profile_exists)

    def test_profile_bio_is_empty(self):
        """
        Test that a profile bio is empty when created
        """
        profile = Profile.objects.get(user=self.user)

        self.assertEqual(profile.bio, "")

    def test_user_with_two_profiles(self):
        """
        Test that a user cannot have more than one profile
        """
        with self.assertRaises(IntegrityError):
            Profile.objects.create(user=self.user, bio="alguma coisa")

    def test_get_profile_with_token(self):
        """
        Test that a user can see their own profile
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }

        login_response = self.client.post(self.login_url, data, format='json')
        token = login_response.data["token"]

        profile_response = self.client.get(self.profile_url, HTTP_AUTHORIZATION=f'Token {token}')
        
        self.assertEqual(profile_response.status_code, 200)
        self.assertIn('user', profile_response.data)
        self.assertEqual(profile_response.data['user']['email'], "user@example.com")
        self.assertEqual(profile_response.data['bio'], "")
        self.assertEqual(profile_response.data['avatar'], None)

    def test_get_profile_without_token(self):
        """
        Test that a user cannot see their own profile if it is not authenticated
        """
        token = "invalidtoken"

        profile_response = self.client.get(self.profile_url, HTTP_AUTHORIZATION=f'Token {token}')
        
        self.assertEqual(profile_response.status_code, 401)

    def test_add_new_bio(self):
        """
        Test that a new bio can be added
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }
        new_bio = {
            "bio": "this is a new bio."
        }

        login_response = self.client.post(self.login_url, data, format='json')
        token = login_response.data["token"]

        response = self.client.put(self.profile_url, new_bio, HTTP_AUTHORIZATION=f'Token {token}', format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['bio'], "this is a new bio.")

    def test_bio_more_than_max_length(self):
        """
        Test that bio field cannot have more than 300 characters
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }

        # 301 characters
        new_bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed justo lorem. Curabitur nec maximus nulla, nec pharetra lectus. Morbi at vestibulum lorem. In vitae venenatis purus, sit amet cursus dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas non."

        login_response = self.client.post(self.login_url, data, format='json')
        token = login_response.data["token"]

        response = self.client.put(self.profile_url, {"bio": new_bio}, HTTP_AUTHORIZATION=f'Token {token}', format='json')

        self.assertEqual(response.status_code, 400)
        self.assertNotEqual(response.data['bio'], new_bio)

    def test_bio_max_length(self):
        """
        Test that bio field can only have up to 300 characters
        """
        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }

        # 300 characters
        new_bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie tortor nec porta ornare. Sed vel lectus finibus nibh interdum finibus ut vitae leo. Phasellus tempus, magna ut posuere hendrerit, diam nulla scelerisque urna, sit amet gravida arcu lacus sit amet elit. Sed et bibendum ipsum nisi."
        
        login_response = self.client.post(self.login_url, data, format='json')
        token = login_response.data["token"]

        response = self.client.put(self.profile_url, {"bio": new_bio}, HTTP_AUTHORIZATION=f'Token {token}', format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['bio'], new_bio)
        self.assertEqual(len(response.data['bio']), len(new_bio))