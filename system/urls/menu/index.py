from django.urls import path
from system.views.menu.teacher import index as teacher_index

urlpatterns = [
    path("send_question/", teacher_index.send_question.as_view(), name="send_question"),
    path("save_text/", teacher_index.save_text.as_view(), name="save_text"),
    path("add_class/", teacher_index.add_class.as_view(), name="add_class"),
    path("tGetQuestionnaire/", teacher_index.tGetQuestionnaire.as_view(), name="tGetQuestionnaire"),
]
