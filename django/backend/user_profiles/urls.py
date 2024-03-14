from django.urls import path
from .views import UserProfileView, UserList


urlpatterns = [
    path('user-profile/', UserProfileView.as_view(), name="user-profile"),
    path('user/', UserList.as_view(), name="user-list"),
]
