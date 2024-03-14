import json
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from user_profiles.models import UserProfile
from user_profiles.serializers import UserProfileSerializer

User = get_user_model()

USR_PROFILE_URL = '/api/profiles/user-profile/'
USR_PROFILE_CREATE_URL = '/api/profiles/user/'


def get_test_user():
    return User.objects.create_user(
        'testuser',
        'testpassword'
    )


class ProfilePublicApiTests(TestCase):
    """Test the publicly available user profile API"""

    def setUp(self):
        self.client = APIClient()
        self.test_user = get_test_user()
        self.test_user_profile = UserProfile.objects.create(
            user=self.test_user,
            contact_email="testemail@gmx.com",
            surname="McTest",
            given_name="Testy"
        )

    def test_login_required_profile(self):
        """Test that login required for retrieving user profile url"""
        print("Test that login required for retrieving user profile url")
        res = self.client.get(USR_PROFILE_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_and_user_profile_creation_success(self):
        "Test that user and profile are successfully created together"""
        print("Test that user and profile are successfully created together")
        payload = {
                'username': 'TestUser2',
                'password': 'testpassword',
                're_password': 'testpassword',
                'profile': {
                    'contact_email': 'testemail@gmx.com',
                    'surname': 'McTest2',
                    'given_name': 'Test'
                }
            }
        res = self.client.post(
            USR_PROFILE_CREATE_URL, data=json.dumps(payload),
            content_type='application/json')
        self.assertEquals(res.data['message'], 'User successfully created!')
        self.assertTrue(
            res.status_code == status.HTTP_201_CREATED)
        self.assertEquals('TestUser2', User.objects.get(username='TestUser2').username)


class ProfilePrivateApiTests(TestCase):
    """Test the privately available user profile API"""

    def setUp(self):
        self.client = APIClient()
        self.test_user = get_test_user()
        self.test_user_profile = UserProfile.objects.create(
            user=self.test_user,
            contact_email="testemail@gmx.com",
            surname="McTest",
            given_name="Testy"
        )
        self.client.force_authenticate(self.test_user)

    def test_retrieve_user_profile(self):
        """Test retrieving user profile"""
        print("Test retrieving user profile")

        res = self.client.get(USR_PROFILE_URL)

        serializer = UserProfileSerializer(self.test_user_profile)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_edit_profile_basic(self):
        """Test editing profile"""
        print("Test editing profile")
        payload = {
            'surname': 'testsirname',
            'given_name': 'testgimmiename',
            'contact_email': 'test2@email.com',
        }
        res = self.client.patch(
            USR_PROFILE_URL, data=json.dumps(payload),
            content_type='application/json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.test_user_profile.refresh_from_db()
        self.assertEqual(self.test_user_profile.surname, payload['surname'])
        self.assertEqual(self.test_user_profile.given_name, payload['given_name'])
        self.assertEqual(self.test_user_profile.contact_email, payload['contact_email'])
