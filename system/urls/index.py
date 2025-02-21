from django.urls import path, include
from system.views.index import index

urlpatterns = [
    path("", index, name="index"),
    path("settings/", include("system.urls.settings.index")),
    path("menu/", include("system.urls.menu.index")),
]