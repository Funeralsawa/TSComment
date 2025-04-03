from django.contrib import admin
from system.models.teacher.teacher import Teacher
from system.models.student.student import Student
from system.models.questionnaire.questionnaire import Questionnaire
from system.models.answer.answer import Answer
from system.models.class_info.class_info import Class

# Register your models here.
admin.site.register(Teacher)
admin.site.register(Student)
admin.site.register(Class)

@admin.register(Questionnaire)
class QuestionnaireAdmin(admin.ModelAdmin):
    list_displays = ['name', 'create_Time', 'content', 'owner']
    search_fields = ['name']
    date_hierarchy = 'create_Time'
    list_per_page = 10

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['questionnaire', 'student_id', 'answers', 'submitted_at']
    search_fields = ['student_id']
