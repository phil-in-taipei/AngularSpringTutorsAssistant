from django.test import TestCase
from django.contrib.auth import get_user_model

from user_profiles.models import UserProfile

User = get_user_model()


def get_test_user():
    return User.objects.create_user(
        'testuser',
        'testpassword'
    )


class ProfileModelTests(TestCase):
    """Test the Profile Model"""

    def setUp(self):
        self.test_user = get_test_user()
        self.test_user_profile = UserProfile.objects.create(
            user=self.test_user,
            contact_email="testemail@gmx.com",
            surname="McTest",
            given_name="Testy"
        )

    def test_user_profile_fields(self):
        """Test the user profile fields"""
        print("Test the user profile fields")
        self.assertEqual(self.test_user_profile.contact_email, 'testemail@gmx.com')
        self.assertEqual(self.test_user_profile.surname, 'McTest')
        self.assertEqual(self.test_user_profile.given_name, 'Testy')
        self.assertEqual(self.test_user_profile.user, self.test_user)

    def test_user_profile_model_str(self):
        """Test the user profile string representation"""
        print("Test the user profile string representation")
        self.assertEqual(str(self.test_user_profile),
                         self.test_user.username)
