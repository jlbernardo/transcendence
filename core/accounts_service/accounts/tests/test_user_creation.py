from django.test import TestCase
from accounts.models.user import CustomUser
from django.db import IntegrityError

class UserTestCase(TestCase):
    def setUp(self):
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
        self.assertTrue(user.is_active)

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

    def test_username_field(self):
        """
        Test that model uses email as identifier
        """
        self.assertEqual(self.user.USERNAME_FIELD, "email")
        #self.assertEqual(self.user.USERNAME_FIELD, "username")
