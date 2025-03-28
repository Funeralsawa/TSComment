from django.urls import path
from system.views.settings.login import signin
from system.views.settings.getinfo import getinfo
from system.views.settings.register import Register
from system.views.settings.get_csrf_token import get_csrf_token
from system.views.settings.setMenuEventListening import SetMenuEventListening
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', signin, name='signin'),
    path('getinfo/', getinfo.as_view(), name="getinfo"),
    path('register/', Register.as_view(), name="Register"),
    path('setMenuEventListening/', SetMenuEventListening.as_view(), name="SetMenuEventListening"),
    path('api/token/', TokenObtainPairView.as_view(), name='settings_api_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='settings_api_token_refresh'),
    path('get_csrf_token/', get_csrf_token.as_view(), name="settings_get_csrf_token"),
]
