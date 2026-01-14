from django.db import IntegrityError
from django.test import TestCase
from accounts.models.user import CustomUser
from accounts.models.profile import Profile
from accounts.serializers.profile import ProfileSerializer
from django.urls import reverse
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

class ProfileTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.profile_url = reverse('profile')
        self.update_profile_url = reverse('update_profile')
        self.avatar_url = reverse('avatar')

        self.user = CustomUser.objects.create_user(
        email="user@example.com", 
        username="user", 
        password="SecurePass123!"
        )

        data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }

        login_response = self.client.post(self.login_url, data, format='json')
        self.token = login_response.data["token"]

    def test_avatar_upload(self):
        """
        Test that authenticated user can upload avatar
        """
        fake_avatar = SimpleUploadedFile(
            name="avatar.png",
            content=b"fake image content",
            content_type="image/png"
        )

        avatar_response = self.client.put(self.avatar_url, {'avatar': fake_avatar}, HTTP_AUTHORIZATION=f'Token {self.token}', format='multipart')
        print(f'avatar_response: {avatar_response.data}')
        
        self.assertEqual(avatar_response.status_code, 200)
        self.assertIn('avatar', avatar_response.data) # exists
        self.assertNotEqual(avatar_response.data['avatar'], '') # not empty
        self.assertIsInstance(avatar_response.data['avatar'], str) # string
        self.assertIn('avatars/', avatar_response.data['avatar']) # in avatars/

    def test_avatar_replacement(self):
        """
        Test that a new upload replace previous avatar stored
        """
