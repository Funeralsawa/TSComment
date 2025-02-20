from django.urls import path
from system.views.settings.login import signin

urlpatterns = [
    path('login/', signin, name='signin'),
]