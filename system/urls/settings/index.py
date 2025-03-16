from django.urls import path
from system.views.settings.login import signin
from system.views.settings.getinfo import getinfo_web
from system.views.settings.register import Register
from system.views.settings.setMenuEventListening import SetMenuEventListening

urlpatterns = [
    path('login/', signin, name='signin'),
    path('getinfo/', getinfo_web, name="getinfo_web"),
    path('register/', Register, name="Register"),
    path('setMenuEventListening/', SetMenuEventListening, name="SetMenuEventListening"),
]
