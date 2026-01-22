from django.test import TestCase, override_settings
from accounts.models.user import CustomUser
from accounts.models.profile import Profile
from django.urls import reverse
from rest_framework.test import APIClient
import tempfile
from accounts.tests.utils.utils import create_fake_image
from PIL import Image

TEMP_MEDIA_ROOT = tempfile.mkdtemp()

@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class AvatarTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.avatar_url = reverse('avatar')

        self.fake_avatar = create_fake_image()

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

    def tearDown(self):
        """
        Clean up avatar files after each test
        """
        profile = Profile.objects.get(user=self.user)
        if profile.avatar:
            profile.avatar.delete(save=False)
            profile.avatar = 'avatars/default.png'
            profile.save(update_fields=['avatar'])

    def test_avatar_default(self):
        """
        Test that a profile avatar is set to default when created
        """
        profile = Profile.objects.get(user=self.user)

        self.assertTrue(profile.avatar)
        self.assertNotEqual(profile.avatar.name, '')
        self.assertEqual(profile.avatar.name, 'avatars/default.png')

    def test_avatar_upload(self):
        """
        Test that authenticated user can upload avatar
        """
        avatar_response = self.client.put(
            self.avatar_url, 
            {'avatar': self.fake_avatar}, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')
        
        self.assertEqual(avatar_response.status_code, 200)
        self.assertIn('avatar', avatar_response.data)
        self.assertIn('avatars/', avatar_response.data['avatar'])

    def test_file_name(self):
        avatar_response = self.client.put(
            self.avatar_url, 
            {'avatar': self.fake_avatar}, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')
        
        self.assertEqual(avatar_response.status_code, 200)

        filename = avatar_response.data['avatar'].split('_')[-2]
        name_without_ext = filename.split('.')[0]
        self.assertEqual(avatar_response.data['id'], int(name_without_ext))

    def test_avatar_replacement(self):
        """
        Test that a new upload replaces the previous avatar stored
        """
        avatar_response = self.client.put(
            self.avatar_url, 
            {'avatar': self.fake_avatar}, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')

        self.assertEqual(avatar_response.status_code, 200)
        avatar_response2 = self.client.put(
            self.avatar_url, 
            {'avatar': create_fake_image()}, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')

        self.assertEqual(avatar_response2.status_code, 200)
    
        self.assertEqual(avatar_response.data['avatar'], avatar_response2.data['avatar'])

    def test_avatar_upload_without_token(self):
        """
        Test that with an invalid token a user cannot upload an avatar
        """
        token = "invalidtoken"

        avatar_response = self.client.put(
            self.avatar_url, 
            {'avatar': self.fake_avatar}, 
            HTTP_AUTHORIZATION=f'Token {token}', 
            format='multipart')
        
        self.assertEqual(avatar_response.status_code, 401)

    def test_upload_without_avatar(self):
        """
        Test that upload fails without avatar
        """
        avatar_response = self.client.put(
            self.avatar_url, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')
        self.assertEqual(avatar_response.status_code, 400)

    def test_file_size_valid(self):
        """
        Test that an upload of up to or equal to 2MB will be accepted
        """
        avatar_response = self.client.put(
            self.avatar_url, 
            {'avatar': create_fake_image(size_mb=2.0)}, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')

        self.assertEqual(avatar_response.status_code, 200)

    def test_file_size_invalid(self):
        """
        Test that an upload of more than 2MB will not be accepted
        """
        avatar_response = self.client.put(
            self.avatar_url, 
            {'avatar': create_fake_image(size_mb=2.1)}, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')
        
        self.assertEqual(avatar_response.status_code, 400)

    def test_avatar_dimensions(self):
        """
        Test that avatar image is modified to standard width and height
        """
        avatar_response = self.client.put(
            self.avatar_url, 
            {'avatar': self.fake_avatar}, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')

        self.assertEqual(avatar_response.status_code, 200)

        profile = Profile.objects.get(user=self.user)
        
        with Image.open(profile.avatar.path) as img:
            self.assertEqual(img.width, 256)
            self.assertEqual(img.height, 256)

    def test_delete_avatar(self):
        """
        Test that avatar is deleted when requested
        """
        avatar_response = self.client.put(
            self.avatar_url, 
            {'avatar': self.fake_avatar}, 
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')
        
        self.assertEqual(avatar_response.status_code, 200)

        delete_response = self.client.delete(
            self.avatar_url,
            HTTP_AUTHORIZATION=f'Token {self.token}', 
            format='multipart')
        
        self.assertEqual(delete_response.status_code, 200)

        profile = Profile.objects.get(user=self.user)

        self.assertEqual(profile.avatar.name, 'avatars/default.png')