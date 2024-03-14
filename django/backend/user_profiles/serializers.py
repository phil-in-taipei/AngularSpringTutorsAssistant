from rest_framework import serializers
#from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from django.contrib.auth import get_user_model
from .models import UserProfile


User = get_user_model()


# this is for nested (one-to-one) relationship user filed
# in the profile display api
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',
                  'username')


# this is for use in displaying and updating user profile and user info
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = "__all__"


# this is for use as the nested profile field in UserCreateSerializer (below)
class UserProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('surname', 'given_name', "contact_email")


# this is used to create new users and the related profile in one api call
# the nested profile field will have an object with the fields in
# UserProfileCreateSerializer (above)
class UserCreateSerializer(serializers.ModelSerializer):
    profile = serializers.RelatedField(read_only=True)
    re_password = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 're_password', 'profile')
