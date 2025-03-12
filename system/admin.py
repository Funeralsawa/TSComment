from django.contrib import admin
from system.models.teacher.teacher import Teacher
from system.models.student.student import Student
from system.models.questionnaire.questionnaire import Questionnaire

# Register your models here.
admin.site.register(Teacher)
admin.site.register(Student)
admin.site.register(Questionnaire)