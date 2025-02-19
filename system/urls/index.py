from django.urls import path, include
from system.views.index import index

urlpatterns = [
    path("", index, name="index"),
]