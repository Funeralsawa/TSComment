from django.urls import path
from system.views.menu import index

urlpatterns = [
    path("logout/", index.logout, name="Menu_logout"),
    path("send_question/", index.send_question, name="send_question"),
    path("save_text/", index.save_text, name="save_text"),
]
