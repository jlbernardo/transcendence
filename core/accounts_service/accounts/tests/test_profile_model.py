from django.test import TestCase
from accounts.models.user import CustomUser
from accounts.models.profile import Profile
from accounts.serializers.profile import ProfileSerializer

class ProfileTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
        email="user@example.com", 
        username="user", 
        password="SecurePass123!"
        )

    def test_profile_creation_with_user_creation(self):
        """
        Test that a profile exists when a user is created
        """
        profile_response = Profile.objects.get(user=self.user)
        self.assertIsNotNone(profile_response)
        self.assertEqual(profile_response.user, self.user)
        self.assertEqual(profile_response.bio, "")
