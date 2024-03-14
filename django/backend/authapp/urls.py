from django.urls import path, include

urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.jwt')),
]

# '/auth/jwt/create' {refresh: , access: }
# '/auth/jwt/refresh' {refresh: refreshToken})
# '/auth/users/me/'
# 'auth/users/